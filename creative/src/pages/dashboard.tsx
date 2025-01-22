import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { SidebarComponent } from "@/components/sidebar";
import MainContentPage from "./mainContent";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen relative">
            {/* Navbar at the top */}
            <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className="flex flex-1 mt-[60px] relative">
                {/* Sidebar Section */}
                <aside
                    className={`fixed top-14 inset-y-0 left-0 w-64 bg-white dark:bg-black border-r transition-transform duration-300 transform
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 z-40`}
                >
                    <SidebarComponent />
                </aside>

                {/* Overlay for smaller screens */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Post Content Section */}
                <main
                    className="flex-1 p-6 overflow-y-auto flex items-center justify-center transition-all duration-300 lg:ml-[250px]"
                >
                    <MainContentPage />
                    <Outlet />
                </main>

                {/* Ads Section (Visible only on md+ screens) */}
                <aside className="w-1/6 min-w-[250px] border-l hidden lg:block border-gray-200 dark:border-gray-700 z-0">
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">Sponsored Ads</h2>
                        <p className="text-gray-500">Advertise your content here.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;
