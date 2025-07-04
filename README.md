# 📝 Blog Application

A full-stack, AI-powered blogging platform built using **Node.js**, **Express**, **MongoDB**, and **React (Vite)**. Designed for modern creators, this platform offers intuitive content management, rich markdown support, and intelligent features like blog post generation with AI.

🚀 **Live Demo**: [https://blog-application-1-1v3z.onrender.com](https://blog-application-1-1v3z.onrender.com)

📡 **API Backend**: [https://blog-application-hgra.onrender.com](https://blog-application-hgra.onrender.com)

---

## 🔑 Key Features

### 🔒 Authentication
- Secure user registration and login with **JWT** and **bcrypt**.
- User roles for managing admin-level access.

### ✍️ Blog Management
- Full **CRUD** operations for blog posts.
- Optional **cover images** and **slug-based URLs**.
- **Draft & Publish Toggle** for flexible publishing.

### 📓 Markdown Editor
- Create blog posts using **Markdown**.
- Live preview with **syntax highlighting**.

### 🤖 AI Integration
- Generate AI-powered, markdown-formatted blog posts from just a title.

### 🏷️ Tags & Filtering
- Tag-based categorization (e.g., React, Node).
- Filter and explore content easily.

### 🔍 Search & Discovery
- Real-time search by **title** or **content**.

### 📊 Admin Dashboard
- Manage users, posts, and analytics with ease.
- Visual insights with charts and summaries.

### 💬 Community Features
- Comment system for readers to leave feedback.
- **Like/Clap button** to engage with content.

### 📈 Post Analytics
- **View counter** to track post popularity.

### 📱 Responsive Design
- Fully optimized for **mobile** and **desktop** experiences.

---

## 🗂️ Project Structure

```bash
backend/
  server.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  uploads/
  utils/

frontend/
  blog-app/
    src/
      components/
      pages/
      context/
      routes/
      utils/
    public/
    index.html
    package.json
```

---

## ⚙️ Getting Started

### ✅ Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)

---

### 🔧 Backend Setup

```bash
cd backend
npm install
# Create a .env file and add the following:
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
npm start
```

---

### 💻 Frontend Setup

```bash
cd frontend/blog-app
npm install
# Create a .env file and add:
# VITE_BACKEND_URL=https://your-backend-url
npm run dev
```

---

## 🚀 Deployment on Render

### 🔁 Backend
- Deploy as a **Web Service**.
- Add environment variables in Render settings.
- Build Command:
```bash
npm install
```
- Start Command:
```bash
node server.js
```

### 🌐 Frontend
```bash
npm run build
# Deploy the dist folder as a Static Site on Render
# Set VITE_BACKEND_URL in environment variables to your backend URL
```

---

## 🔐 Environment Variables

### Backend `.env`
```bash
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend `.env`
```bash
VITE_BACKEND_URL=https://your-backend-url
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Developer

**Pushkar Kumar Saini** 
