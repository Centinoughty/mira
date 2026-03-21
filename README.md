# Mira - Collaborative Task Manager

Mira is a full-stack collaborative task management application that lets you create and manage tasks, organize team members, assign work across your team, and track progress.

## Documentation

| File                                 | Description                                       |
| ------------------------------------ | ------------------------------------------------- |
| [README.md](./README.md)             | Installation steps and project overview           |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, data flow, and technical decisions |

## Features

- **Google Authentication** - secure sign-in via Google OAuth, with JWT access/refresh token rotation
- **Personal Task Management** — create, edit, delete, and complete tasks with priority levels and deadlines
- **Team Management** — create teams, invite members by email, and manage membership at any time
- **Task Assignment** — assign tasks to team members directly from the task form
- **Date Filtering** — tasks are automatically separated into Today and Next 7 Days buckets

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker](https://www.docker.com/) and Docker Compose
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mira.git
cd mira
```

### 2. Configure environment variables

Copy the `.env.example` to create `.env` in root, `client` and `server` dirs and fill in the values

### 3. Start the Docker (recommended)

This starts the database, server, and client together:

```bash
docker compose up --build
```

### 4. Run database migrations

In a separate terminal, once the containers are running:

```bash
docker exec -it mira-server npx prisma migrate dev
```

## Running Without Docker

If you prefer to run the client and server locally without containers, make sure PostgreSQL is running and accessible, then update `DATABASE_URL` in `server/.env` to point to your local instance.

**Server:**

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```

**Client** (in a separate terminal):

```bash
cd client
npm install
npm run dev
```

---

## Seeding the Database

There is no seed file included, but you can populate the database with test data by following these steps:

### 1. Create a user

Sign in with a real Google account via the login page. This creates your first user in the database automatically.

### 2. Create additional test users

To test task assignment and team collaboration, sign in with additional Google accounts (e.g. using different browser profiles or incognito windows). Each sign-in creates a new user row.

### 3. Create teams

Once you have two or more users, log in as one user and navigate to the **Teams** page. Create a team and invite the other users by their Google email addresses.

### 4. Assign tasks

From the **Teams** page, click **Assign Task** on a team card. The task will appear on the assignee's dashboard in real time.

### Inspecting the data

If you want to view or manually edit the database, you can use Prisma Studio:

```bash
cd server
npx prisma studio
```

This opens a browser-based GUI at `http://localhost:5555` where you can browse and edit all tables directly.

---

## AI Usage

### What I used AI for

- Writing code for the controllers where I give the entire workflow and wireframes along with use cases for it to work perfectly
- Debugging runtime errors such as the `mutate` vs `mutateAsync` issue with TanStack Query and the JWT cookie path misconfiguration
- Architecture brainstorming for the WebSocket notification layer and the token refresh interceptor flow

### What I reviewed and changed manually

- All Prisma schema decisions — specifically making `teamId` nullable on `Task` so personal tasks are unaffected by team deletion, and ensuring cascade rules were correct
- The authentication flow end-to-end, including the redirect loop fix between the Axios interceptor and the login page
- The date filtering logic for today/upcoming tasks, adding the month and year checks to prevent false positives across months
- Component structure and state management patterns, consolidating multiple `useState` calls into a single `values` object across forms
- The socket authentication middleware, fixing the type casting approach between the base `Socket` type and `AuthenticatedSocket`
- Fixing lint errors given by ESLint for not having unnoticed errors in the future

### One example where I disagreed with the AI output

I asked the AI to help me with the task which I gave it which was well prompted, and I asked AI to give me the exact output by giving well optimised prompt, so I never have to disagree with the AI output

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:3000` to **Authorised JavaScript origins**
4. Copy the **Client ID** into both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (client) and `GOOGLE_CLIENT_ID` (server)
