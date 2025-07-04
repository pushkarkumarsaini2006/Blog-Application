# 📝 Blog Application

A full-stack, AI-powered blogging platform built with **Node.js**, **Express**, **MongoDB**, and **React (Vite)**. Designed for modern creators to efficiently write, manage, and share blog posts with a modern, responsive UI and AI-powered features.

🚀 **Live Demo**:
- Backend: [YOUR_BACKEND_URL_HERE]
- Frontend: [YOUR_FRONTEND_URL_HERE]

---

## 🔑 Key Features
- User dashboard with blog post and comment management
- Create, update, and manage blog posts with markdown support
- AI-powered blog post and comment generation
- Tag-based categorization and real-time search
- Admin dashboard with analytics and user management
- Community features: comments, likes/claps
- Mobile responsive UI

---

## 🗂️ Project Structure

```
backend/
  package.json
  server.js
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
    uploadMiddleware.js
  models/
    BlogPost.js
    Comment.js
    User.js
  routes/
    aiRoutes.js
    authRoutes.js
    blogPostRoutes.js
    commentRoutes.js
    dashboardRoutes.js
  uploads/
    ...
  utils/
    prompts.js
frontend/
  blog-app/
    package.json
    vite.config.js
    index.html
    public/
      favicon.svg
      vite.svg
      404.html
    src/
      App.jsx
      index.css
      main.jsx
      assets/
        auth-img.jpg
        default-profile.svg
        logo.svg
        react.svg
      components/
        DeleteAlertContent.jsx
        Drawer.jsx
        Modal.jsx
        SafeImage.jsx
        Tabs.jsx
        Auth/
          Login.jsx
          SignUp.jsx
        Cards/
          BlogPostIdeaCard.jsx
          ...
        Charts/
        Inputs/
        layouts/
        Loader/
      context/
        userContext.jsx
      pages/
        Admin/
        Blog/
      routes/
        PrivateRoute.jsx
      styles/
        performance.css
      utils/
        apiPaths.js
        axiosInstance.js
        config.js
        data.js
        helper.js
        imageLoader.js
        uploadImage.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)

---

### Backend Setup

```
cd backend
npm install
# Create a .env file and add:
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
npm start
```

---

### Frontend Setup

```
cd frontend/blog-app
npm install
# Create a .env file and add:
# VITE_BACKEND_URL=http://localhost:5000
# For deployed usage, set VITE_BACKEND_URL to your backend URL
npm run dev
```

---

## 🚀 Deployment on Render

### Backend
- Deploy as a **Web Service**
- Build Command: `npm install`
- Start Command: `node server.js`
- Add environment variables in Render settings

### Frontend
- Build Command: `npm run build`
- Deploy the `dist` folder as a Static Site on Render
- Set `VITE_BACKEND_URL` in environment variables to your backend URL

---

## 🔐 Environment Variables

### Backend `.env`
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend `.env`
```
VITE_BACKEND_URL=http://localhost:5000
# For deployed usage, set VITE_BACKEND_URL to your backend URL
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Developer

**Pushkar Kumar Saini**
