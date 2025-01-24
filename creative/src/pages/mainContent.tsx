import PostCard from "@/components/postCard";
import { Post } from "@/types/post";
import React, { useState } from "react";


const MainContentPage: React.FC = () => {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: "How to optimize your React app?",
      author: "devguru",
      authorImage: "https://randomuser.me/api/portraits/men/32.jpg", // Example image
      upvotes: 340,
      comments: 25,
      createdAt: "2 hours ago",
      content: "React performance optimization can be achieved through lazy loading, memoization, and more.",
      image: "https://media2.dev.to/dynamic/image/width=775%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F5l0p991kt5vziivrqxyk.png",
    },
    {
      id: 2,
      title: "What's new in TypeScript 5.0?",
      author: "codewizard",
      authorImage: "https://randomuser.me/api/portraits/men/45.jpg",
      upvotes: 550,
      comments: 40,
      createdAt: "1 day ago",
      content: "TypeScript 5.0 introduces significant performance boosts and new language features...",
    },
    {
      id: 3,
      title: "What's new in Tailwind CSS 3.0?",
      author: "csspro",
      authorImage: "https://randomuser.me/api/portraits/women/20.jpg",
      upvotes: 120,
      comments: 15,
      createdAt: "3 days ago",
      content: "Tailwind CSS 3.0 comes with new utilities and performance improvements.",
      image: "https://media2.dev.to/dynamic/image/width=775%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F5l0p991kt5vziivrqxyk.png",
    },
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
