import { Post } from "@/types/post";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom"; // Assuming React Router for navigation
import { Icons } from "./icons";
import { formatDistanceToNow } from "date-fns";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "./authContext";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  const isAuthor = user?.id === post.authorId;
  
  const handleEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.put(
        `http://localhost:8000/post/${post.id}`,
        {
          title: editTitle,
          content: editContent,
        },
        { withCredentials: true }
      );
      
      toast.success("Post updated successfully!");
      setIsEditModalOpen(false);
      // Refresh the page to show updated content
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:8000/post/${post.id}`, {
        withCredentials: true
      });
      
      toast.success("Post deleted successfully!");
      // Refresh the page to remove the deleted post
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const postUrl = `${window.location.origin}/post/${post.id}`;
    
    try {
      if (navigator.share) {
        // Use native sharing if available (mobile)
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: postUrl,
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(postUrl);
        toast.success("Post URL copied to clipboard!");
      }
    } catch (error) {
      console.error('Share error:', error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = postUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success("Post URL copied to clipboard!");
      } catch (fallbackError) {
        toast.error("Failed to copy URL");
      }
    }
  };
  
  return (
    <div className="border rounded-lg p-4 transition duration-300">
          <Link to={`/post/${post.id}`} >
      {/* Author and Date */}
      <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={post.author.profilePicture || "/default-avatar.png"}
              alt={post.author.userName || "User"}
            />
            <AvatarFallback>
              {post.author.userName ? post.author.userName.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
           <Link to={`/profile/${post.author.id}`} className="hover:underline">
          <span className="text-sm">{post.author.userName || "Anonymous"}</span>
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

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Three Dots Menu for Author */}
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {isDeleting ? "Deleting..." : "Delete Post"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Share Icon */}
          <div 
            className="cursor-pointer hover:text-gray-800 transition-colors"
            onClick={handleShare}
            title="Share post"
          >
            <Icons.share className="w-5 h-5" />
          </div>
        </div>
      </div>
      </Link>
      
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Enter post content"
                className="min-h-[120px] resize-none"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Updating..." : "Update Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default PostCard;
