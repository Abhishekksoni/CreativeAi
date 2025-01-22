import { ThemeProvider } from "@/components/theme-provider";
 // Import your Navbar component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar";
import DashboardLayout from "./pages/dashboard";
import PostDetailsPage from "./pages/postDetails";
import { useState } from "react";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Routes>
          <Route path="/" element={<DashboardLayout/>} />
          <Route path="/post/:postId" element={<PostDetailsPage />} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
