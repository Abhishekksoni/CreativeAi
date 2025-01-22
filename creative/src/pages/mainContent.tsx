import PostCard from "@/components/postCard";
import { Post } from "@/types/post";
import React, { useState } from "react";


const MainContentPage: React.FC = () => {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: "How to optimize your React app?",
      author: "devguru",
      subreddit: "r/reactjs",
      upvotes: 340,
      comments: 25,
      createdAt: "2 hours ago",
      content: "React performance optimization can be achieved through lazy loading, memoization, and more.",
    },
    {
      id: 2,
      title: "What's new in TypeScript 5.0?",
      author: "codewizard",
      subreddit: "r/programming",
      upvotes: 550,
      comments: 40,
      createdAt: "1 day ago",
      content: "TypeScript 5.0 introduces significant performance boosts and new language features...",
    },
    // Add more dummy posts here
  ]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Trending Posts</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default MainContentPage;
