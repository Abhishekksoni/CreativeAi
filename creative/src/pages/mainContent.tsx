import PostCard from "@/components/postCard";
import { Post } from "@/types/post";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios

const MainContentPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // To hold the posts
  const [loading, setLoading] = useState<boolean>(true); // Loading state to track data fetch
  const [error, setError] = useState<string>(""); // Error state to handle errors during fetch

  // Fetch posts from your API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/post"); // Replace with your actual API endpoint
        setPosts(response.data); // Update the posts state with the fetched data
      } catch (error: unknown) {
        setError("Failed to fetch posts"); // Handle any errors
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched or an error occurs
      }
    };

    fetchPosts();
  }, []); // Empty array to run only once when the component is mounted

  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there's an issue with the API request
  }

  return (
    <div className="max-w-4xl mx-auto py-0">
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} /> // Render each post as a PostCard
          ))
        ) : (
          <div>No posts available</div> // Message if no posts are found
        )}
      </div>
    </div>
  );
};

export default MainContentPage;


