# Blog Application

A production-oriented full-stack blogging platform that combines content publishing, admin analytics, and AI-assisted writing.

## Live Deployments

- Frontend: https://blog-application-1-i0me.onrender.com
- Backend API: https://blog-application-54yd.onrender.com

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Data Model](#data-model)
- [Authentication and Authorization](#authentication-and-authorization)
- [AI Features](#ai-features)
- [Environment Variables](#environment-variables)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap Ideas](#roadmap-ideas)
- [License](#license)

## Project Overview

This project is a modern blog platform with:

- Public blog reading experience with search, tags, likes, views, and comments
- Admin/member role support with protected authoring and moderation workflows
- Markdown-enabled editor and media upload support
- Dashboard metrics for content operations
- AI endpoints powered by Gemini for idea generation and drafting support

The app is organized as a monorepo with two major parts:

- `backend`: Express + MongoDB REST API
- `frontend/blog-app`: React + Vite client application

## Core Features

- Role-based authentication (`admin`, `member`) using JWT
- Rich post lifecycle: create, update, draft/publish, delete
- Multiple post categories/types: `blog`, `news`, `thought`
- Public-facing UX:
  - post feed and detail pages
  - tag filtering and search
  - trending posts
  - likes and view tracking
  - comments and threaded replies
- Admin dashboard:
  - summary cards/metrics
  - post management
  - comment moderation/management
- AI assistance:
  - post generation
  - post idea generation
  - summary generation
  - comment reply generation
- Media support:
  - profile images
  - cover images
  - static upload serving from backend

## Tech Stack

### Backend

- Node.js (18+)
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- File upload (`multer`)
- Google GenAI SDK (`@google/genai`)

### Frontend

- React 19
- Vite 6
- Tailwind CSS 4
- React Router 7
- Axios
- Recharts
- React Markdown + MDEditor

## Architecture

### Request Flow

1. Frontend calls backend REST endpoints via Axios.
2. Backend routes requests to controllers.
3. Controllers validate/authenticate and operate on Mongoose models.
4. Protected routes use middleware for JWT and role checks.
5. AI endpoints call Gemini through utility/controller layer.
6. Responses return JSON payloads consumed by React pages and components.

### High-Level Responsibilities

- `routes/`: route registration and endpoint grouping
- `controllers/`: endpoint business logic
- `models/`: database schemas
- `middlewares/`: auth, rate limiting, upload controls
- `utils/`: shared helpers (moderation, prompts, mirror synchronization)

## Folder Structure

```text
backend/
  config/
    db.js
  controllers/
    aiController.js
    authController.js
    blogPostController.js
    commentController.js
    dashboardController.js
  middlewares/
    authMiddleware.js
    rateLimitMiddleware.js
    uploadMiddleware.js
  models/
    BlogPost.js
    Comment.js
    NewsPost.js
    ThoughtPost.js
    User.js
  routes/
    aiRoutes.js
    authRoutes.js
    blogPostRoutes.js
    commentRoutes.js
    dashboardRoutes.js
  utils/
    contentModeration.js
    postTypeMirrorSync.js
    prompts.js
  uploads/
  server.js

frontend/blog-app/
  src/
    components/
    context/
    hooks/
    pages/
    routes/
    styles/
    utils/
    App.jsx
    main.jsx
```

## Data Model

Primary collections:

- `users`
- `blogposts`
- `comments`
- `newsposts`
- `thoughtposts`

Data behavior:

- `blogposts` acts as the canonical source for all post content.
- `postType` field differentiates `blog`, `news`, and `thought` entries.
- `newsposts` and `thoughtposts` are maintained as mirror collections for type-specific operations and visibility.

## Authentication and Authorization

- JWT-based authentication for protected APIs
- User roles supported by backend access control
- Admin-only protections for dashboard operations
- Middleware-driven route guarding in backend
- Frontend private route handling for restricted screens

## AI Features

AI endpoints are designed for content acceleration while keeping editorial control with the user.

Available actions:

- Generate long-form post drafts
- Generate blog post ideas/topics
- Generate concise summaries
- Generate suggested comment replies

Configuration is managed by:

- `GEMINI_API_KEY` for API access
- `GEMINI_MODEL` for optional model override

## Environment Variables

### Backend (`backend/.env`)

- `PORT=5000` (optional)
- `NODE_ENV=development` (optional)
- `MONGO_URI=<your_mongodb_connection_string>`
- `JWT_SECRET=<your_jwt_secret>`
- `ADMIN_ACCESS_TOKEN=<token_for_admin_signup>` (recommended)
- `GEMINI_API_KEY=<your_gemini_api_key>` (required for AI endpoints)
- `GEMINI_MODEL=gemini-2.0-flash` (optional)
- `FORCE_HTTPS=true|false` (optional)

### Frontend (`frontend/blog-app/.env`)

- `VITE_BACKEND_URL=http://localhost:5000`

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- npm 8+
- MongoDB (local instance or Atlas)

### 1) Clone and Install

```bash
git clone <your-repo-url>
cd Blog-Application

cd backend
npm install

cd ../frontend/blog-app
npm install
```

### 2) Configure Environment

- Create `backend/.env` and add backend variables
- Create `frontend/blog-app/.env` and add frontend variables

### 3) Run Backend

```bash
cd backend
npm run dev
```

### 4) Run Frontend

```bash
cd frontend/blog-app
npm run dev
```

Default local URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Available Scripts

### Backend scripts (`backend/package.json`)

- `npm run dev`: Start backend with nodemon
- `npm start`: Start backend with Node.js
- `npm run build`: Build placeholder (Render compatibility)
- `npm run test-connection`: Test database connection
- `npm run health-check`: Run health utility script
- `npm run debug`: Start dev mode with explicit `NODE_ENV=development`
- `npm run prepare-deploy`: Reinstall deps for deployment preparation

### Frontend scripts (`frontend/blog-app/package.json`)

- `npm run dev`: Start Vite dev server
- `npm run build`: Build frontend assets
- `npm run preview`: Preview production build
- `npm run lint`: Lint source files
- `npm run build:render`: Build with production mode
- `npm run build:production`: Build with hosted backend URL
- `npm start`: Preview server on `0.0.0.0:3000`

## API Overview

Base URL (local): `http://localhost:5000`

### System

- `GET /` - API metadata/basic service response
- `GET /health` - health check
- `GET /ping` - wake/ping endpoint

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)
- `POST /api/auth/upload-image`

### Posts

- `GET /api/posts`
- `GET /api/posts/slug/:slug`
- `GET /api/posts/tag/:tag`
- `GET /api/posts/search`
- `GET /api/posts/trending`
- `POST /api/posts` (protected)
- `PUT /api/posts/:id` (protected)
- `DELETE /api/posts/:id` (protected)
- `POST /api/posts/:id/view`
- `POST /api/posts/:id/like`

### Comments

- `GET /api/comments`
- `GET /api/comments/:postId`
- `POST /api/comments/:postId` (protected)
- `DELETE /api/comments/:commentId` (protected)

### Dashboard

- `GET /api/dashboard-summary` (protected, admin-only)

### AI

- `POST /api/ai/generate` (protected)
- `POST /api/ai/generate-ideas` (protected)
- `POST /api/ai/generate-reply` (protected)
- `POST /api/ai/generate-summary`

## Deployment Notes

- Backend and frontend are configured for Render-style deployments.
- CORS is handled for local and hosted scenarios.
- Uploaded media is exposed from backend `/uploads` path.
- Ensure environment variables are set in hosting provider dashboards.
- For production, prefer a managed MongoDB deployment and strong JWT secrets.

## Troubleshooting

- Backend fails to start:
  - verify `MONGO_URI` and `JWT_SECRET`
  - run `npm run test-connection` inside `backend`
- Frontend cannot reach API:
  - verify `VITE_BACKEND_URL`
  - check backend is running and CORS is configured for frontend origin
- AI endpoints fail:
  - verify `GEMINI_API_KEY`
  - confirm model value in `GEMINI_MODEL` (if provided)
- Upload issues:
  - verify upload middleware limits and destination permissions
  - ensure backend static serving of `/uploads` is active

## Roadmap Ideas

- Add automated test suites (unit/integration/e2e)
- Add refresh token flow and token rotation
- Add richer moderation tooling and abuse reporting
- Add observability (structured logs and tracing)
- Add CI pipeline for lint/build/test/deploy checks

## License

ISC
