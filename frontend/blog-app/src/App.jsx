import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import BlogLandingPage from "./pages/Blog/BlogLandingPage";
import BlogPostView from "./pages/Blog/BlogPostView";
import PostByTags from "./pages/Blog/PostByTags";
import SearchPosts from "./pages/Blog/SearchPosts";
import AdminLogin from "./pages/Admin/AdminLogin";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import BlogPosts from "./pages/Admin/BlogPosts";
import BlogPostEditor from "./pages/Admin/BlogPostEditor";
import Comments from "./pages/Admin/Comments";
import UserProvider from "./context/userContext";
import BackendStatusIndicator from "./components/BackendStatusIndicator";
import { validateEnvironment, checkBackendConnectivity } from "./utils/environment";

const App = () => {
  useEffect(() => {
    // Validate environment on app startup
    const config = validateEnvironment();
    
    // Check backend connectivity
    checkBackendConnectivity().then(isConnected => {
      if (!isConnected) {
        console.warn('Backend is not immediately reachable. This is normal for free tier deployments.');
      }
    });
  }, []);

  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<BlogLandingPage />} />
            <Route path="/:slug" element={<BlogPostView />} />
            <Route path="/tag/:tagName" element={<PostByTags />} />
            <Route path="/search" element={<SearchPosts />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/posts" element={<BlogPosts />} />
              <Route path="/admin/create" element={<BlogPostEditor />} />
              <Route
                path="/admin/edit/:postSlug"
                element={<BlogPostEditor isEdit={true} />}
              />
              <Route path="/admin/comments" element={<Comments />} />
            </Route>

            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </Router>

        <Toaster
          position="top-right"
          toastOptions={{
            className: "react-hot-toast",
            style: {
              fontSize: "13px",
              animation: "none", // Disable default animations
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#ffffff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#EF4444',
                color: '#ffffff',
              },
            },
            loading: {
              style: {
                background: '#F59E0B',
                color: '#ffffff',
              },
            },
          }}
          containerStyle={{
            animation: "none", // Disable container animations
          }}
        />
        
        <BackendStatusIndicator />
      </div>
    </UserProvider>
  );
};

export default App;
