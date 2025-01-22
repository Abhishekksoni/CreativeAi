import { Navbar } from "@/components/navbar";
import { SidebarComponent } from "@/components/sidebar";
import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Assuming React Router for dynamic routing

const PostDetailsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Extracting the post ID
  // Fetch detailed post data based on `postId` here
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // <div className=" mx-auto py-6">
    //     <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    //   <h1 className="text-2xl font-bold mb-4">Post Details</h1>
    //   <p className="text-gray-700">Detailed content for post ID: {postId}</p>
    //   {/* Add more details and layout as needed */}
    // </div>
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
           
        >
           <h1 className="text-2xl font-bold mb-4">Post Details</h1>
           <p className="text-gray-700">Detailed content for post ID: {postId}</p>
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

export default PostDetailsPage;
