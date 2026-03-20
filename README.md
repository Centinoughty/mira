# Mira - Collaborative Task Manager

Mira is a full-stack collaborative task management application that lets you create and manage tasks, organize team members, assign work across your team, and track progress.

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

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:3000` to **Authorised JavaScript origins**
4. Copy the **Client ID** into both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (client) and `GOOGLE_CLIENT_ID` (server)
