import { AuthContext } from "@/components/authContext";
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
      await axios.post("http://localhost:8000/post", {
        title: postTitle,
        content: postContent,
        authorId: user.id, 
      },
      {
        withCredentials: true // Add this
      });

      // Refresh the post list after submission
      const response = await axios.get("http://localhost:8000/post");
      setPosts(response.data);

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
          posts.map((post) => <PostCard key={post.id} profile={post.author.id}  post={post} />)
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
            />
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
