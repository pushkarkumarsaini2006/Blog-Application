# Blog Application

An extensible full-stack publishing platform for creating, managing, and distributing technical content. The application combines a public reading experience with authenticated writing, threaded discussions, administrator workflows, operational analytics, media uploads, and AI-assisted content production.

## Executive Summary

Blog Application is structured as a deployable monorepo containing:

- A React and Vite web client for readers, members, and administrators.
- An Express REST API for authentication, publishing, comments, analytics, media, and AI services.
- MongoDB persistence through Mongoose.
- Render Blueprint configuration for repeatable frontend and backend deployment.

The platform is suitable as a content hub for a technical team, developer community, or organization that needs a lightweight editorial workflow without introducing a separate CMS. It supports the complete content lifecycle from idea generation and drafting through publishing, discovery, engagement, moderation, and performance review.

## Business Capabilities

### Audience and publishing

- Public landing page with blog, news, and thought content.
- Search by title and content.
- Tag-based discovery.
- Pagination and load-more reading flows.
- Markdown content with GitHub-Flavored Markdown, syntax highlighting, tables, links, images, and copyable code blocks.
- Post slugs generated for human-readable URLs.
- Draft and published states.
- Cover images for supported post types.
- View and like tracking.
- Social sharing through Facebook, X/Twitter, LinkedIn, and clipboard copy.

### Community participation

- Member and administrator registration and login.
- Authenticated post creation through the writing workspace.
- Comments on published posts.
- One-level threaded replies.
- Comment listing and deletion workflows.
- Basic content moderation for posts and comments.
- Registration, comment, and post-creation rate limiting.

### Administration and insight

- Administrator dashboard with content and engagement metrics.
- Total posts, drafts, published posts, views, likes, comments, and AI-generated content counts.
- Top-performing posts.
- Recent comments.
- Tag usage aggregation.
- Post management with create, edit, publish, save-as-draft, and delete actions.
- Comment management and moderation view.

### AI-assisted content operations

The AI layer is designed to accelerate editorial work while leaving final decisions with the author. It supports:

- Long-form Markdown draft generation.
- Technical post idea generation.
- Suggested replies to comments.
- Post title and summary generation.

The backend uses the Google GenAI SDK and can fall back to locally generated content when the configured Gemini provider is unavailable or returns unusable output.

## User Roles

| Role | Capabilities |
| --- | --- |
| Reader | Browse published content, search, filter by tag, view posts, like posts, read comments, and share content. |
| Member | All reader capabilities, plus account access, post creation, comments, threaded replies, and AI-assisted writing actions. |
| Administrator | Member capabilities, plus dashboard analytics, post operations, and comment management screens. |

Administrator registration requires the configured `ADMIN_ACCESS_TOKEN`. Registration without that token creates a member account.

## Technology Stack

### Backend

- Node.js 18 or later
- Express 4
- MongoDB and Mongoose 8
- JWT authentication
- bcryptjs password hashing
- Multer multipart upload handling
- Google GenAI SDK
- CORS and dotenv configuration

### Frontend

- React 19
- Vite 6
- React Router 7
- Tailwind CSS 4
- Axios
- Recharts
- React Markdown with remark-gfm
- `@uiw/react-md-editor`
- React Hot Toast
- React Icons and React Share

### Hosting and operations

- Render web service for the API
- Render static site for the frontend
- MongoDB Atlas or another reachable MongoDB deployment
- Optional Google AI Studio/Gemini API access

## Architecture

```text
                         +----------------------+
                         |   Reader / Author     |
                         |   Administrator       |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | React + Vite client  |
                         | Public and admin UI  |
                         +----------+-----------+
                                    |
                              REST / JSON
                                    |
                                    v
                         +----------------------+
                         | Express REST API     |
                         | Routes and middleware|
                         +----+----------+------+
                              |          |
                    Mongoose  |          | Google GenAI
                              v          v
                    +---------+--+   +---+----------------+
                    | MongoDB    |   | AI generation and  |
                    | content    |   | local fallbacks    |
                    | and users  |   +--------------------+
                    +------------+
                              |
                              v
                    +----------------------+
                    | backend/uploads      |
                    | Local media storage  |
                    +----------------------+
```

### Backend request flow

1. The frontend builds API URLs from `VITE_BACKEND_URL` and sends requests with Axios.
2. Express parses JSON, form data, and multipart uploads.
3. CORS validates the configured frontend origin and local development origins.
4. Protected routes validate a JWT from the `Authorization: Bearer <token>` header.
5. Route handlers delegate to controllers for validation, business logic, persistence, and response shaping.
6. Mongoose reads and writes MongoDB collections.
7. AI controllers call Gemini when configured and use local fallbacks when necessary.

### Repository responsibilities

- `backend/routes`: HTTP route registration and middleware composition.
- `backend/controllers`: request handling and application behavior.
- `backend/models`: Mongoose schemas and collection definitions.
- `backend/middlewares`: authentication, rate limiting, and file-upload constraints.
- `backend/utils`: moderation, AI prompts, image and post-type helpers.
- `frontend/blog-app/src/pages`: public, authoring, and administrator screens.
- `frontend/blog-app/src/components`: reusable UI, cards, inputs, charts, and layout elements.
- `frontend/blog-app/src/context`: authenticated user state.
- `frontend/blog-app/src/utils`: API paths, Axios configuration, environment validation, image handling, and shared helpers.

## Data Model

### User

Stores the account identity and authorization information:

- Name and unique, normalized email.
- bcrypt-hashed password.
- Profile image URL and biography.
- Role: `admin` or `member`.
- Created and updated timestamps.

### BlogPost

The canonical content collection. A post contains:

- `title` and unique `slug`.
- `postType`: `blog`, `news`, or `thought`.
- Markdown `content`.
- Optional `coverImageUrl`.
- Tags.
- Author reference to `User`.
- `isDraft` state.
- View and like counters.
- `generatedByAI` flag.
- Created and updated timestamps.

### Comment

Stores discussion associated with a post:

- Reference to the parent `BlogPost`.
- Reference to the authoring `User`.
- Comment content.
- Optional `parentComment` reference for replies.
- Created and updated timestamps.

### NewsPost and ThoughtPost

These are synchronized mirror collections for type-specific querying and presentation. `BlogPost` remains the canonical authoring source, and the mirror synchronization utility updates the type-specific records after content changes and during database startup.

## Frontend Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Blog landing page and content discovery. |
| `/:slug` | Public | Post detail page. |
| `/tag/:tagName` | Public | Posts filtered by tag. |
| `/search` | Public | Search results. |
| `/admin-login` | Public | Login and registration entry point. |
| `/write` | Member or administrator | Authenticated writing workspace. |
| `/admin/dashboard` | Administrator | Analytics and recent activity. |
| `/admin/posts` | Administrator | Post list and lifecycle management. |
| `/admin/create` | Administrator | Create an administrator post. |
| `/admin/edit/:postSlug` | Administrator | Edit an existing post. |
| `/admin/comments` | Administrator | Comment management. |

## API Reference

The local API base URL is `http://localhost:5000`. Deployed clients use the Render backend URL supplied through `VITE_BACKEND_URL`.

### System and media

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | API metadata and endpoint overview. |
| `GET` | `/health` | Public | Service health response for monitoring and Render. |
| `GET` | `/ping` | Public | Lightweight wake-up/ping response. |
| `GET` | `/uploads/:filename` | Public | Serves an uploaded media file. |

### Authentication and profile

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public, rate limited | Creates a member or administrator account. |
| `POST` | `/api/auth/login` | Public | Authenticates a user and returns a JWT. |
| `GET` | `/api/auth/profile` | JWT required | Returns the authenticated profile. |
| `POST` | `/api/auth/upload-image` | Currently public | Accepts one multipart file in the `image` field and returns its public URL. |

### Posts

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/posts` | Public | Lists posts; supports status, type, pagination, and random selection options. |
| `GET` | `/api/posts/slug/:slug` | Public | Loads a post by slug. |
| `GET` | `/api/posts/tag/:tag` | Public | Lists posts for a tag. |
| `GET` | `/api/posts/search?q=...` | Public | Searches post titles and content. |
| `GET` | `/api/posts/trending` | JWT required | Returns top posts by engagement. |
| `POST` | `/api/posts` | JWT required, rate limited | Creates a post. |
| `PUT` | `/api/posts/:id` | JWT required | Updates a post. |
| `DELETE` | `/api/posts/:id` | JWT required | Deletes a post. |
| `POST` | `/api/posts/:id/view` | Public | Increments the view counter. |
| `POST` | `/api/posts/:id/like` | Public | Increments the like counter. |

### Comments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/comments` | Public | Lists comments for administration or operational views. |
| `GET` | `/api/comments/:postId` | Public | Lists comments and replies for a post. |
| `POST` | `/api/comments/:postId` | JWT required, rate limited | Adds a comment or reply. |
| `DELETE` | `/api/comments/:commentId` | JWT required | Deletes a comment. |

### Dashboard and AI

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/dashboard-summary` | JWT and administrator role required | Returns content, engagement, comment, AI, top-post, and tag metrics. |
| `POST` | `/api/ai/generate` | JWT required | Generates a draft post. |
| `POST` | `/api/ai/generate-ideas` | JWT required | Generates technical content ideas. |
| `POST` | `/api/ai/generate-reply` | JWT required | Suggests a reply to a comment. |
| `POST` | `/api/ai/generate-summary` | Currently public | Generates a title and summary for supplied content. |

Protected requests use:

```http
Authorization: Bearer <jwt>
```

## Environment Configuration

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/blog_application
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_ACCESS_TOKEN=replace-with-an-administrator-registration-token
GEMINI_API_KEY=replace-with-a-google-ai-studio-key
GEMINI_MODEL=gemini-2.0-flash
FRONTEND_URL=http://localhost:5173
FORCE_HTTPS=false
```

Create `frontend/blog-app/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Only variables prefixed with `VITE_` are exposed to the browser. Never place `MONGO_URI`, `JWT_SECRET`, `ADMIN_ACCESS_TOKEN`, or `GEMINI_API_KEY` in frontend environment files.

### Configuration reference

| Variable | Application | Required | Purpose |
| --- | --- | --- | --- |
| `MONGO_URI` | Backend | Yes | MongoDB connection string. |
| `JWT_SECRET` | Backend | Yes | Signs and verifies seven-day JWTs. |
| `ADMIN_ACCESS_TOKEN` | Backend | For admin registration | Allows a registration request to create an administrator account. |
| `GEMINI_API_KEY` | Backend | For provider-backed AI | Authenticates requests to Google GenAI. Local fallbacks remain available. |
| `GEMINI_MODEL` | Backend | No | Overrides the default Gemini model selection. |
| `FRONTEND_URL` | Backend | Production | Allowed deployed frontend origin for CORS. |
| `PORT` | Backend | No | API port; defaults to the hosting platform's port or `5000` locally. |
| `NODE_ENV` | Backend | No | Controls production behavior and error responses. |
| `FORCE_HTTPS` | Backend | No | Forces generated upload URLs to use HTTPS. |
| `VITE_BACKEND_URL` | Frontend | Yes | API base URL compiled into the frontend. |

## Local Development

### Prerequisites

- Node.js 18 or later.
- npm 8 or later.
- A reachable MongoDB instance, local or hosted.
- Optional: Google AI Studio API key for provider-backed AI generation.

### Installation

From the repository root:

```bash
cd backend
npm install

cd ../frontend/blog-app
npm install
```

Create the two environment files described above before starting the services.

### Start the API

```bash
cd backend
npm run dev
```

The API is available at `http://localhost:5000` unless `PORT` is changed.

### Start the web client

In a second terminal:

```bash
cd frontend/blog-app
npm run dev
```

The Vite development server is normally available at `http://localhost:5173`.

### First administrator setup

1. Set `ADMIN_ACCESS_TOKEN` in `backend/.env`.
2. Start both services.
3. Open `/admin-login` in the frontend.
4. Register using the administrator access token.
5. Use the resulting account to open the dashboard and authoring workflows.

## Available Scripts

### Backend scripts

Run from `backend`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the API with Nodemon. |
| `npm start` | Starts the API with Node.js. |
| `npm run build` | Executes the hosting-compatible build placeholder. |
| `npm run test-connection` | Verifies the MongoDB connection. |
| `npm run health-check` | Runs the health-check utility. |
| `npm run debug` | Starts development mode with `NODE_ENV=development`. |
| `npm run prepare-deploy` | Reinstalls dependencies for deployment preparation. |

### Frontend scripts

Run from `frontend/blog-app`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Creates the production frontend bundle. |
| `npm run lint` | Runs ESLint across the frontend. |
| `npm run preview` | Serves the production bundle locally. |
| `npm run build:render` | Builds using the production Vite mode. |
| `npm run build:production` | Builds against the configured hosted backend URL in the script. |
| `npm start` | Serves the built site on port `3000`. |

## Deployment on Render

The repository includes [`render.yaml`](render.yaml), which defines:

- `blog-application-api`: Node web service rooted at `backend`.
- `blog-application-web`: static site rooted at `frontend/blog-app`.
- API build command: `npm ci`.
- API start command: `npm start`.
- API health check: `/health`.
- Frontend build command: `npm ci && npm run build`.
- Frontend publish directory: `dist`.
- SPA rewrite from `/*` to `/index.html`.
- Automatic injection of the backend host into `VITE_BACKEND_URL`.

### Deployment procedure

1. Push the repository to a Git provider supported by Render.
2. Create a Render Blueprint from the repository and apply `render.yaml`.
3. Provision MongoDB Atlas or another MongoDB service.
4. Configure the API service variables:
   - `FRONTEND_URL`: the exact deployed frontend URL.
   - `MONGO_URI`: the database connection string.
   - `JWT_SECRET`: a long, randomly generated secret.
   - `ADMIN_ACCESS_TOKEN`: a private administrator registration token.
   - `GEMINI_API_KEY`: optional provider key.
   - `GEMINI_MODEL`: optional model override.
5. Confirm the API health check returns HTTP 200.
6. Open the frontend and verify registration, login, content loading, comments, AI actions, and media handling.

### Media storage limitation

The current upload implementation stores files under `backend/uploads` and serves them from the API. Render web-service disks are ephemeral, so uploaded files can be lost during restarts, redeployments, or instance replacement. For durable production media, integrate an object-storage provider such as Amazon S3, Cloudflare R2, or Cloudinary and persist the returned URL in MongoDB.

## Security and Operational Posture

Current controls include:

- bcrypt password hashing.
- JWT authentication with seven-day token expiry.
- Role-aware frontend route protection and administrator dashboard protection.
- CORS origin configuration through `FRONTEND_URL`.
- JSON and URL-encoded request limits of 10 MB.
- File upload filtering for JPEG, PNG, and WebP with a 5 MB limit.
- Basic content moderation for posts and comments.
- In-memory rate limits for registration, comments, and post creation.
- Production error responses that avoid returning stack traces.

Before positioning the application as a hardened enterprise production service, address these known gaps:

- Move uploads to durable, authenticated object storage.
- Protect the currently public image-upload endpoint and review public summary generation for abuse and cost controls.
- Enforce author or administrator ownership checks consistently for post and comment mutations.
- Replace process-local rate limits with a shared store for multi-instance deployments.
- Add refresh-token rotation or another session-revocation strategy.
- Add request validation, security headers, structured logging, monitoring, and audit trails.
- Add automated unit, integration, API, and browser-level tests.
- Add CI checks for linting, builds, dependency scanning, and deployment validation.

These are documented as implementation priorities rather than claims about functionality already present in the repository.

## Quality and Verification

The repository currently provides build, lint, health-check, and database-connection scripts. It does not currently define an automated test suite in either package manifest.

Recommended verification before release:

```bash
cd frontend/blog-app
npm run lint
npm run build

cd ../../backend
npm run test-connection
npm run health-check
```

For a deployment smoke test, verify:

- `GET /health` returns a successful response.
- The frontend can load public posts from the deployed API.
- Registration and login return a usable JWT.
- Protected writing and administrator routes enforce access correctly.
- Comments, likes, views, AI actions, and uploads behave as expected.
- Production media survives a restart only after object storage is configured.

## Project Structure

```text
Blog-Application/
├── backend/
│   ├── config/                 MongoDB connection and startup synchronization
│   ├── controllers/            Authentication, posts, comments, dashboard, and AI logic
│   ├── middlewares/            JWT protection, rate limits, and uploads
│   ├── models/                 User, post, mirror, and comment schemas
│   ├── routes/                 Express API route modules
│   ├── uploads/                Local uploaded media directory
│   ├── utils/                  Moderation, prompts, and synchronization utilities
│   ├── server.js               Express application entry point
│   └── package.json             Backend scripts and dependencies
├── frontend/blog-app/
│   ├── public/                 Static assets and SPA fallback
│   ├── src/
│   │   ├── components/         Reusable UI, cards, charts, inputs, and layouts
│   │   ├── context/             User authentication state
│   │   ├── hooks/               Shared React hooks
│   │   ├── pages/               Public blog and administrator screens
│   │   ├── routes/              Frontend route guards
│   │   ├── styles/              Shared and performance styles
│   │   └── utils/               API, environment, image, and upload helpers
│   ├── index.html
│   └── package.json              Frontend scripts and dependencies
├── render.yaml                  Render Blueprint deployment definition
├── README.md                     Project documentation
└── LICENSE                       ISC license
```

## Product Roadmap

Prioritized opportunities for the next delivery phases:

1. Durable object-storage media integration and image lifecycle management.
2. Consistent authorization and ownership enforcement across every mutation endpoint.
3. Shared rate limiting, request validation, security headers, and audit logging.
4. Automated test coverage and CI/CD quality gates.
5. Observability with structured logs, uptime checks, metrics, and alerting.
6. Editorial workflow improvements such as scheduled publishing, revision history, and richer moderation tools.
7. Advanced analytics for traffic sources, content cohorts, and engagement trends.

## License

This project is licensed under the ISC License. See [`LICENSE`](LICENSE) for details.
