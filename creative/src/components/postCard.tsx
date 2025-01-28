import { Post } from "@/types/post";
import React from "react";
import { Link } from "react-router-dom"; // Assuming React Router for navigation
import { Icons } from "./icons";
import { formatDistanceToNow } from "date-fns";
import { User } from "@/types/user";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  return (
    // <Link to={`/post/${post.id}`} >
    <div className="border rounded-lg p-4 transition duration-300">
          <Link to={`/post/${post.id}`} >
      {/* Author and Date */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {post.author.profilePicture && (
            <img
              src={post.author.profilePicture}
              alt={post.author.userName}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
           <Link to={`/profile/${post.author.id}`} className="hover:underline">
          <span className="text-sm">{post.author.userName}</span>
          </Link>
        </div>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>

      {/* Post Title */}
      <h2 className="text-lg font-semibold mt-2">
        <Link to={`/post/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      {/* Post Content */}
      <p className="text-sm mt-1 line-clamp-2">{post.content}</p>

      {/* Post Image */}
      <Link to={`/post/${post.id}`} className="hover:underline">
      {post.imageUrl && (
        <div className="mt-3">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      )}
</Link>
      {/* Interaction Icons */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-6">
          {/* Like Icon */}
          <div className="flex items-center space-x-1  cursor-pointer hover:text-gray-800">
            <Icons.reaction className="w-5 h-5" />
            {/* <span className="text-sm">Like</span> */}
          </div>

          {/* Comment Icon */}
          <div className="flex items-center space-x-1  cursor-pointer hover:text-gray-800">
            <Icons.comment className="w-5 h-5" />
            <span className="text-sm">{post.comments}</span>
          </div>
          {/* Comment Icon */}
          <div className="flex items-center space-x-1  cursor-pointer hover:text-gray-800">
            <Icons.save className="w-5 h-5" />
            {/* <span className="text-sm">{post.comments}</span> */}
          </div>
        </div>

        {/* Save Icon */}
        <div className="cursor-pointer hover:text-gray-800">
          <Icons.share className="w-5 h-5" />
        </div>
      </div>
      </Link>
    </div>

  );
};

export default PostCard;
