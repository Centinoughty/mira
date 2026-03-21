# Mira — Architecture Overview

## High-Level Structure

Mira is a monorepo split into two independently deployable applications — a **Next.js client** and an **Express server** — backed by a **PostgreSQL** database. They communicate over two channels: a REST API for data operations and a persistent **WebSocket** connection (Socket.io) for real-time notifications.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│   Next.js 16 (App Router)                               │
│   ├── REST API calls (Axios)                            │
│   └── WebSocket connection (Socket.io-client)           │
└────────────────────┬────────────────────────────────────┘
                     │  HTTP + WS (same port)
┌────────────────────▼────────────────────────────────────┐
│                   Express Server                        │
│                                                         │
│   ├── REST routes  (/auth, /task, /team)                │
│   ├── Socket.io server                                  │
│   ├── Prisma ORM                                        │
│   └── JWT auth (access + refresh tokens)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              PostgreSQL (Neon / Docker)                  │
└─────────────────────────────────────────────────────────┘
```

---

## Authentication

Mira uses **Google OAuth** for identity and **JWT** for session management. There are two tokens, both stored as `httpOnly` cookies so JavaScript cannot access them:

- **Access token** — short-lived (15 minutes). Sent on every API request and verified by the `requireAuth` middleware.
- **Refresh token** — long-lived (7 days). Used only by the `POST /auth/refresh` endpoint to issue a new access token silently.

The Axios interceptor on the client handles token rotation automatically. When any API call returns a 401, it fires a refresh request and retries the original call. If the refresh also fails, the user is redirected to `/login`. Endpoints like `/auth/google`, `/auth/refresh`, and `/auth/me` are excluded from this retry loop to prevent redirect cycles.

```
Client                        Server
  │── POST /auth/google ──────▶│  Verify Google idToken
  │◀── Set accessToken cookie ─│  Create/find user in DB
  │◀── Set refreshToken cookie ─│  Sign both JWTs
  │                             │
  │── GET /task (401) ─────────▶│  accessToken expired
  │── POST /auth/refresh ───────▶│  Verify refreshToken
  │◀── Set new accessToken ─────│
  │── GET /task (retry) ────────▶│  Success
```

---

## Server Architecture

The server follows a **modular route-controller** pattern. Each domain (auth, task, team) owns its own folder containing a route file, controller, and Zod schema.

```
server/src/
├── index.ts                  # Entry point
├── server.ts                 # Express + Socket.io setup
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── socket.ts             # Socket.io init + notifyUser()
│   └── google.ts             # Google token verification
├── middlewares/
│   ├── auth.ts               # requireAuth — verifies accessToken cookie
│   ├── validate.ts           # Zod middleware — validates body/params/query
│   └── socketAuth.ts         # Socket.io auth middleware
├── modules/
│   ├── auth/                 # Google login, refresh, logout, /me
│   ├── task/                 # CRUD, toggle, member assignment
│   └── team/                 # CRUD, member management
├── types/
│   └── request.ts            # TypedRequest, AuthUser, AuthenticatedSocket
└── utils/
    └── jwt.ts                # sign/verify access and refresh tokens
```

Every route goes through two layers before hitting a controller — `requireAuth` confirms the request has a valid token, and `validate()` parses and type-checks the payload with Zod. Controllers only run if both pass.

```
Request → requireAuth → validate(Schema) → controller → Prisma → DB
```

---

## Real-time Layer (Socket.io)

The WebSocket server runs on the **same HTTP server and port** as the REST API. Socket.io's `socketAuth` middleware authenticates the connection using the access token passed in `socket.handshake.auth.token`.

An in-memory `Map<userId, socketId>` tracks which socket belongs to which user. When a task is assigned, the controller calls `notifyUser(userId, "task:assigned", data)` which looks up the target's socket and emits directly to them.

```
Task created/updated with memberIds
         │
         ▼
  task.controller.ts
         │
         ├── prisma.task.create()
         │
         └── for each new member:
               notifyUser(member.userId, "task:assigned", { task, assignedBy })
                     │
                     ▼
               socket.to(socketId).emit(...)
                     │
                     ▼
               Client: "task:assigned" event
                     │
                     ├── Show toast notification
                     └── invalidateQueries(["tasks"])
```

If the target user is offline their notification is silently dropped — there is no persistent notification queue. This is acceptable for the current scope but would be the first thing to add for production hardening (e.g. storing unread notifications in the DB).

---

## Client Architecture

The client uses the **Next.js App Router** with a `(dashboard)` route group that wraps all authenticated pages in a shared sidebar/navbar layout.

```
client/src/
├── app/
│   ├── layout.tsx              # Root layout — mounts Providers
│   ├── login/page.tsx          # Google sign-in
│   └── (dashboard)/
│       ├── layout.tsx          # Sidebar + Navbar shell
│       ├── page.tsx            # Dashboard — today/upcoming tasks
│       └── teams/page.tsx      # Team management
├── api/                        # Axios functions (one file per domain)
├── components/
│   ├── common/                 # TaskForm, Sidebar, Navbar
│   └── ui/                     # TaskItem, Modal, Input, Title
├── context/
│   └── SocketContext.tsx       # Socket.io connection + event listeners
├── hooks/
│   ├── useTask.ts              # TanStack Query + mutations for tasks
│   ├── useTeam.ts              # TanStack Query + mutations for teams
│   └── useUser.ts              # Current user query
├── lib/
│   └── socket.ts               # Socket.io client singleton
└── types/                      # TypeScript interfaces
```

State management is handled entirely by **TanStack Query**. There is no global state store — server state lives in the query cache and is kept fresh through `invalidateQueries` after mutations. All mutations implement **optimistic updates**: the UI reflects the change immediately and rolls back if the server call fails.

---

## Database Schema

```
User ──< Task          (one user owns many tasks)
User ──< TaskMember    (a user can be a member of many tasks)
Task ──< TaskMember    (a task can have many assigned members)

User ──< Team          (one user owns many teams)
User ──< TeamMember    (a user can be a member of many teams)
Team ──< TeamMember    (a team has many members)
Team ──< Task          (optional — tasks created within a team context)
```

All foreign keys use `onDelete: Cascade` so deleting a user, task, or team cleans up all child records automatically. The `teamId` on `Task` is nullable — tasks created from the personal dashboard have no team association, while tasks created from the Teams page carry the originating team's ID. Deleting a team cascades to all its tasks.

---

## Infrastructure

Local development uses **Docker Compose** to run three containers — PostgreSQL, the Express server, and the Next.js client — with volume mounts for hot reload. The server and client are independently deployable; the recommended production targets are **Render** (server) and **Vercel** (client) with **Neon** as the managed PostgreSQL provider.

The build pipeline on Render runs `prisma db push && prisma generate && tsc` at build time, and `node dist/index.js` at start time. `prisma db push` is used instead of `migrate deploy` because migration files are not committed to the repository.
