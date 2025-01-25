import { ThemeProvider } from "@/components/theme-provider";
 // Import your Navbar component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar";
import DashboardLayout from "./pages/dashboard";
import PostDetailsPage from "./pages/postDetails";
import { useState } from "react";
import { AuthProvider } from "./components/authContext";
import Login from "./pages/login";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/protectedRoute";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}> {/* Protect Profile route */}
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/post/:postId" element={<PostDetailsPage />} />
            <Route path="/about" element={<h1>About Page</h1>} />
            <Route path="/contact" element={<h1>Contact Page</h1>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
