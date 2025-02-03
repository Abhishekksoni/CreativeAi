// src/layouts/MainLayout.jsx
import { Navbar } from "@/components/navbar";
import { Outlet } from "react-router-dom";

const MainLayout = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Outlet /> {/* This renders the nested route components */}
    </>
  );
};

export default MainLayout;
