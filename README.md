# Blog Application

Full-stack blog platform with AI-assisted writing, built using Node.js, Express, MongoDB, React, and Vite.

Live URLs
- Backend: https://blog-application-54yd.onrender.com
- Frontend: https://blog-application-1-i0me.onrender.com

## Current Features
- Authentication with roles: admin and member
- Create, edit, publish, and draft posts
- Post types: blog, news, thought
- AI-assisted post ideas, post generation, summaries, and comment replies
- Public feed with search, tags, trending, comments, views, and likes
- Admin dashboard with metrics and moderation tools
- Thought feed improvements:
  - Thought cards do not show cover images
  - See More Thoughts pagination on landing page

## Data Model Notes
MongoDB collections currently used:
- users
- blogposts
- comments
- thoughtposts
- newsposts

How post data is stored:
- blogposts is the primary source for all post types
- Each post has postType = blog | news | thought
- thoughtposts and newsposts are maintained as mirror collections for easier database visibility and filtering by type

## Project Structure
backend
- config
- controllers
- middlewares
- models
- routes
- uploads
- utils

frontend/blog-app
- src/components
- src/context
- src/hooks
- src/pages
- src/routes
- src/styles
- src/utils

## Local Setup
Prerequisites
- Node.js 18+
- npm
- MongoDB local or cloud

Backend
1. Go to backend folder
2. Install packages: npm install
3. Create .env file with:
   - MONGO_URI=your_mongodb_uri
   - JWT_SECRET=your_jwt_secret
   - GEMINI_API_KEY=your_gemini_key (optional, AI fallback exists)
4. Run server: npm run dev or npm start

Frontend
1. Go to frontend/blog-app folder
2. Install packages: npm install
3. Create .env file with:
   - VITE_BACKEND_URL=http://localhost:5000
4. Run app: npm run dev

## API Highlights
- Auth
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/profile
- Posts
  - GET /api/posts
  - GET /api/posts/slug/:slug
  - POST /api/posts
  - PUT /api/posts/:id
  - DELETE /api/posts/:id
  - POST /api/posts/:id/view
  - POST /api/posts/:id/like
- Comments
  - GET /api/comments/:postId
  - POST /api/comments/:postId
- AI
  - POST /api/ai/generate
  - POST /api/ai/generate-ideas
  - POST /api/ai/generate-summary
  - POST /api/ai/generate-reply

## Cleanup Done
- Removed empty unused files:
  - backend/test-connectivity.js
  - frontend/blog-app/src/utils/connectivityTest.js
  - frontend/blog-app/src/components/Debug/ConnectivityDebugger.jsx

## License
MIT
