import { AuthContext } from "@/components/authContext";
import { uploadImage } from "@/components/aws";
import PostCard from "@/components/postCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/types/post";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainContentPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/post");
        setPosts(response.data);
        console.log(response.data);
      } catch (error: unknown) {
        setError("Failed to fetch posts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // if (!user) return null;

  // Function to handle post creation
  const handleCreatePost = async () => {
    if (!postTitle || !postContent) {
      alert("Please fill in all fields");
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
          withCredentials: true // Add this
        });

      // Refresh the post list after submission
      const response = await axios.get("http://localhost:8000/post");
      setPosts(response.data);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trending Posts</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Post</Button>
      </div>

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} profile={post.author.id} post={post} />)
        ) : (
          <div>No posts available</div>
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
              maxLength={3000}
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
};

export default MainContentPage;
