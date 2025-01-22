import { Post } from "@/types/post";
import React from "react";

import { Link } from "react-router-dom"; // Assuming React Router for navigation

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="border rounded-lg p-4 transition duration-300">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{post.subreddit}</span>
        <span className="text-xs text-gray-400">{post.createdAt}</span>
      </div>
      <h2 className="text-lg font-semibold mt-2">
        <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{post.content}</p>

      {/* Image Section */}
      {post.image && (
        <div className="mt-3">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 text-sm">{post.upvotes} upvotes</span>
          <span className="text-gray-600 text-sm">{post.comments} comments</span>
        </div>
        <span className="text-sm text-gray-500">by {post.author}</span>
      </div>
    </div>
  );
};

export default PostCard;
