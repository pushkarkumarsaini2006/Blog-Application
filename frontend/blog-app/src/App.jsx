import { BrowserRouter as Router, Routes, Route } from "react-router-d        />
        
        <DebugUserInfo />
      </div>
    </UserProvider>;;
import { Toaster } from "react-hot-toast";

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
import DebugUserInfo from "./components/DebugUserInfo";

const App = () => {
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
          }}
          containerStyle={{
            animation: "none", // Disable container animations
          }}
        />
        
        <DebugUserInfo />
      </div>
    </UserProvider>
  );
};

export default App;
