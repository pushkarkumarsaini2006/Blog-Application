# Blog Application

Full-stack blog platform with role-based access, markdown editing, image uploads, analytics dashboard, and AI-assisted writing tools.

Current stack:
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React 19, Vite 6, Tailwind CSS 4
- AI: Google GenAI (Gemini) with model fallback support

Live URLs:
- Frontend: https://blog-application-1-i0me.onrender.com
- Backend API: https://blog-application-54yd.onrender.com

## Current Status (April 2026)

Implemented and active:
- Role-based auth (`admin`, `member`) with JWT
- Post lifecycle: create, edit, publish, draft, delete
- Post types: `blog`, `news`, `thought`
- Public content experience:
  - landing feed and post detail pages
  - search and tag filtering
  - trending posts, views, and likes
  - comments and replies
- Admin area:
  - dashboard summary metrics
  - post and comment management
- AI tools:
  - generate post content
  - generate post ideas
  - generate summaries
  - generate comment replies
- Upload and static media serving via `/uploads`

## Data Model Notes

Collections in use:
- `users`
- `blogposts`
- `comments`
- `thoughtposts`
- `newsposts`

Storage behavior:
- `blogposts` is the primary source for all post types.
- Each post carries `postType = blog | news | thought`.
- `thoughtposts` and `newsposts` are mirror collections maintained for easier type-specific visibility/filtering.

## Project Structure

```text
backend/
  config/
  controllers/
  middlewares/
  models/
  routes/
  uploads/
  utils/

frontend/blog-app/
  src/components/
  src/context/
  src/hooks/
  src/pages/
  src/routes/
  src/styles/
  src/utils/
```

## Environment Variables

Backend (`backend/.env`):
- `PORT=5000` (optional)
- `NODE_ENV=development` (optional)
- `MONGO_URI=<your_mongodb_connection_string>`
- `JWT_SECRET=<your_jwt_secret>`
- `ADMIN_ACCESS_TOKEN=<token_for_admin_signup>` (optional but recommended)
- `GEMINI_API_KEY=<your_gemini_key>` (required for AI endpoints)
- `GEMINI_MODEL=gemini-2.0-flash` (optional override)
- `FORCE_HTTPS=true|false` (optional)

Frontend (`frontend/blog-app/.env`):
- `VITE_BACKEND_URL=http://localhost:5000`

## Local Development

Prerequisites:
- Node.js 18+
- npm
- MongoDB (local or cloud)

Backend:
1. `cd backend`
2. `npm install`
3. Configure `backend/.env`
4. Start server:
   - Development: `npm run dev`
   - Production-style: `npm start`

Frontend:
1. `cd frontend/blog-app`
2. `npm install`
3. Configure `frontend/blog-app/.env`
4. Start app: `npm run dev`

Default local URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Scripts

Backend (`backend/package.json`):
- `npm run dev` - Run backend with nodemon
- `npm start` - Run backend with node
- `npm run test-connection` - MongoDB connectivity check
- `npm run health-check` - Backend health utility

Frontend (`frontend/blog-app/package.json`):
- `npm run dev` - Start Vite dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview build output
- `npm run lint` - Run ESLint

## API Overview

Base backend URL: `http://localhost:5000` (or your deployed backend URL)

System:
- `GET /` - API metadata
- `GET /health` - health check
- `GET /ping` - wake/ping endpoint

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)
- `POST /api/auth/upload-image`

Posts:
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

Comments:
- `GET /api/comments`
- `GET /api/comments/:postId`
- `POST /api/comments/:postId` (protected)
- `DELETE /api/comments/:commentId` (protected)

Dashboard:
- `GET /api/dashboard-summary` (protected, admin only)

AI:
- `POST /api/ai/generate` (protected)
- `POST /api/ai/generate-ideas` (protected)
- `POST /api/ai/generate-reply` (protected)
- `POST /api/ai/generate-summary`

## Deployment Notes

- Backend includes CORS handling for localhost and hosted domains.
- Uploads are served as static assets from `/uploads` with cache headers.
- Render deployment scripts are present in backend and frontend package configs.

## License

ISC
