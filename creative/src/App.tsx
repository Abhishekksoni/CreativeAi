import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "@/components/authContext";

import ProtectedRoute from "@/components/protectedRoute";
import DashboardLayout from "@/pages/dashboard";
import PostDetailsPage from "@/pages/postDetails";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import ProfileBuilder from "@/pages/buildProfile";
import MainLayout from "./layout/mainLayout";
import ProfileSettings from "./pages/settings/setting";
import EditProfilePage from "./pages/settings/profileSetting";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            {/* Routes using the MainLayout (with Navbar) */}
            <Route element={<MainLayout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}>
              <Route path="/" element={<DashboardLayout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/post/:postId" element={<PostDetailsPage />} />
              <Route path="/about" element={<h1>About Page</h1>} />
              <Route path="/contact" element={<h1>Contact Page</h1>} />
              {/* <Route path="/settings" element={<ProfileSettings/>} /> */}
              <Route path="/settings/profile" element={<ProfileSettings/>} />
              
              {/* Protected Route inside MainLayout */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Profile Builder - No Navbar */}
            <Route path="/profile-builder" element={<ProfileBuilder />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
