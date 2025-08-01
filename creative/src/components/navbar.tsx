import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

import { ModeToggle } from "./ui/toggle";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "./authContext";
import creativeAiLogo from "@/assets/creativeAi.png";
import { uploadImage } from "./aws";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import axios from "axios";
// import { useAuth } from "@/components/authContext"; // Adjust the import based on your auth context

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border bg-gray-200 dark:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Icons.moon className="h-5 w-5" /> : <Icons.sun className="h-5 w-5" />}
    </button>
  );
};



interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Navbar({ setIsSidebarOpen }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Use your auth context to get the user and logout function
  
  // Create post state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Helper function to get profile picture URL
  const getProfilePictureUrl = (avatar: string | undefined): string | undefined => {
    if (!avatar) return undefined;
    
    try {
      // Try to parse as JSON first (in case it's stored as JSON string)
      const parsed = JSON.parse(avatar);
      return typeof parsed === 'string' ? parsed : avatar;
    } catch {
      // If parsing fails, return the original string
      return avatar;
    }
  };
  
  // Debug: Log user data to see what's available
  React.useEffect(() => {
    if (user) {
      console.log('Navbar user data:', user);
    }
  }, [user]);

  const handleLoginClick = () => {
    navigate("/login"); // Navigate to /login page
  };

  const handleLogoutClick = () => {
    logout(); // Call the logout function from your auth context
    navigate("/"); // Redirect to the home page after logout
  };

  // Function to handle post creation
  const handleCreatePost = async () => {
    if (!postTitle || !postContent) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl: string | null = null;

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        if (!imageUrl) throw new Error("Image upload failed.");
      }

      await axios.post("http://localhost:8000/post", {
        title: postTitle,
        content: postContent,
        imageUrl,
        authorId: user?.id,
      },
        {
          withCredentials: true
        });

      // Reset form
      setSelectedImage(null);
      setPostTitle("");
      setPostContent("");
      setIsModalOpen(false);

      toast.success("Post created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error("Failed to create post", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<div className="flex items-center justify-between px-3 py-3 border-b bg-white dark:bg-black border-gray-100 dark:border-gray-800 fixed top-0 w-full z-50 h-16">
  <Link to="/" className="flex items-center space-x-2 h-full">
    <Icons.ham
      className="h-8 w-8 block lg:hidden cursor-pointer"
      onClick={() => setIsSidebarOpen((prev) => !prev)}
    />
    <img
      src={creativeAiLogo}
      alt="CreativeAI Logo"
      className="h-[90px] object-contain dark:invert dark:brightness-200"
    />
  </Link>
      <div className="hidden md:flex  space-x-2 flex-1 max-w-2xl mx-8">
        {/* Search Box */}
        <div className="relative flex-1 w-auto">
          <input
            type="text"
            placeholder="Search posts, users, or topics..."
            className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>


      </div>

      <div className="flex items-center space-x-4">
                {/* Create Post Button */}
                <Button 
          onClick={() => setIsModalOpen(true)}
          className="hidden md:flex px-4 py-2 rounded-lg items-center space-x-2"
        >
          {/* <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg> */}
          <span>Create Post</span>
        </Button>
        <ModeToggle />
        {user ? (
          // Show profile dropdown if user is logged in
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none">
                <Avatar>
                  <AvatarImage 
                  className="object-cover"
                    src={getProfilePictureUrl(user.avatar)} 
                    alt={user.name} 
                    onLoad={(e) => {
                      console.log('Avatar image loaded successfully:', e.currentTarget.src);
                    }}
                    onError={(e) => {
                      console.log('Avatar image failed to load:', user.avatar);
                      console.log('Attempted URL:', e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogoutClick}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Show login button if user is not logged in
          <Button onClick={handleLoginClick} className="px-4 py-2">
            Log in
          </Button>
        )}
      </div>

      {/* Create Post Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Post Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <Textarea
              placeholder="Write your content here..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            {/* for image upload */}
            <div className="w-full">
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Add an image <span className="text-gray-400">(optional, JPG/PNG, max 5MB)</span>
              </label>

              <div
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-blue-500 transition duration-200"
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                    }
                  }}
                />
                <svg
                  className="w-10 h-10 mb-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15a4 4 0 004 4h10a4 4 0 004-4M7 10l5-5 5 5M12 15V4"
                  />
                </svg>
                <p className="text-gray-500">Click or drag image to upload</p>
                <p className="text-xs text-gray-400">Supports JPG, PNG, GIF</p>
              </div>

              {selectedImage && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md border border-gray-200"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={handleCreatePost}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

