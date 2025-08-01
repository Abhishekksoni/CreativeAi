import { CommentSection } from "@/components/comments";
import { Icons } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { SidebarComponent } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import creativeAiLogo from "@/assets/creativeAi.png";
import { AuthContext } from "@/components/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 




// const PostDetailsPage: React.FC = () => {
//   const { postId } = useParams<{ postId: string }>(); // Extracting the post ID
//   // Fetch detailed post data based on `postId` here
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [post, setPost] = useState<any>(null); 

//   useEffect(() => {
//     // Fetch post details from the server
//     axios.get(`http://localhost:8000/post/${postId}`).then((response) => {
//       setPost(response.data);
//     });
//   }, [postId]);

//   if (!post) {
//     return <div>Loading...</div>; // Show a loading state while the post is being fetched
//   }
const PostDetailsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get profile picture URL
  const getProfilePictureUrl = (author: any): string | undefined => {
    if (!author) return undefined;
    
    // Try different possible field names
    const possibleFields = ['avatar', 'profilePicture', 'profile_picture'];
    for (const field of possibleFields) {
      if (author[field]) {
        try {
          // Try to parse as JSON first (in case it's stored as JSON string)
          const parsed = JSON.parse(author[field]);
          return typeof parsed === 'string' ? parsed : author[field];
        } catch {
          // If parsing fails, return the original string
          return author[field];
        }
      }
    }
    return undefined;
  };


  useEffect(() => {
    axios.get(`http://localhost:8000/post/${postId}`).then((response) => {
      setPost(response.data);
      setEditTitle(response.data.title);
      setEditContent(response.data.content);
      console.log('Post author data:', response.data.author);
    });

    axios.get(`http://localhost:8000/comment/${postId}`).then((response) => {
      setComments(response.data);
    });
  }, [postId]);

  const isAuthor = user?.id === post?.authorId;

  const handleEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.put(
        `http://localhost:8000/post/${postId}`,
        {
          title: editTitle,
          content: editContent,
        },
        { withCredentials: true }
      );
      
      toast.success("Post updated successfully!");
      setIsEditModalOpen(false);
      
      // Refresh post data
      const response = await axios.get(`http://localhost:8000/post/${postId}`);
      setPost(response.data);
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
      await axios.delete(`http://localhost:8000/post/${postId}`, {
        withCredentials: true
      });
      
      toast.success("Post deleted successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    
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

  if (!post) {
        return <div>Loading...</div>; // Show a loading state while the post is being fetched
      }

      if (!postId) {
        return <div>Invalid post ID</div>;
      }    

  // const handleAddComment = async () => {
  //   try {
  //     await axios.post(`http://localhost:8000/comment/`, { 
  //     postId, content: newComment
  //    },
  //    {
  //     withCredentials: true // Add this
  //   }
  //   );
  //     setNewComment("");
  //     const updatedComments = await axios.get(`http://localhost:8000/comment/${postId}`);
  //     setComments(updatedComments.data);
  //   } catch (error) {
  //     console.error("Error adding comment", error);
  //   }
  // };

  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      await axios.post(
        `http://localhost:8000/comment/`, 
        { 
          postId,
          content,
          parentId // Add this to support nested comments
        },
        {
          withCredentials: true
        }
      );
      
      // Fetch updated comments
      const updatedComments = await axios.get(`http://localhost:8000/comment/${postId}`);
      setComments(updatedComments.data);
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  

  return (
   
   <div className="flex flex-col h-screen relative">
              {/* Navbar at the top */}
              <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
  
              <div className="flex flex-1 mt-[60px] relative">
                  {/* Sidebar Section */}
                  <aside
                      className={`fixed inset-y-0 left-0 w-64  bg-white  dark:bg-[#030712] border-r transition-transform duration-300 transform
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
            className="flex-1 p-6 overflow-y-auto flex-col items-center justify-center transition-all duration-300 lg:ml-[250px]"
        >
          <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                      className="object-cover"
                        src={getProfilePictureUrl(post.author) || "/default-avatar.png"}
                        alt={post.author.userName}
                      />
                      <AvatarFallback>{post.author.userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{post.author.userName}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Share Button - Available to everyone */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="h-8 px-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share
                    </Button>
                    
                    {/* Three Dots Menu for Author */}
                    {isAuthor && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => setIsEditModalOpen(true)}
                            className="cursor-pointer"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleDelete}
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
                  </div>
                </div>
          
                {/* Post Title */}
                <h2 className="text-lg font-semibold mt-2">
                    {post.title}
                </h2>
          
                {/* Post Content */}
                <p className="text-sm mt-2 ">{post.content}</p>
          
                {/* Post Image */}
                {post.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>

                )}
                 {/* Interaction Icons */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-6">
                          {/* Like Icon */}
                          <div className="flex items-center space-x-1  cursor-pointer hover:text-gray-800">
                          <button  className="cursor-pointer hover:text-gray-800">
                            <Icons.reaction className="w-5 h-5" />
                            </button>
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
                
                        {/* Share Icon */}
                        <div 
                          className="cursor-pointer hover:text-gray-800 transition-colors"
                          onClick={handleShare}
                          title="Share post"
                        >
                          <Icons.share className="w-5 h-5" />
                        </div>
                      </div>


                 {/* Comment Section */}
                 <CommentSection
          postId={postId}
          comments={comments}
          onAddComment={handleAddComment}
        />
        </main>
       

        {/* Ads Section (Visible only on md+ screens) */}
        <aside className="w-1/6 min-w-[300px] border-l hidden lg:block border-gray-200 dark:border-gray-700 z-0">
            <div className="p-5 ml-6 mt-3 border rounded-lg max-w-[260px]">
                <h2 className="text-xl font-semibold">
                <div className="flex space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                      className="object-cover"
                        src={getProfilePictureUrl(post.author) || "/default-avatar.png"}
                        alt={post.author.userName}
                      />
                      <AvatarFallback>{post.author.userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-md">{post.author.userName}</span>
                  </div>
                </h2>
                {/* <p className="text-gray-500">Advertise your content here.</p> */}
                <Button className="items-center mt-4 min-w-[220px]">Follow</Button>
            </div>
        </aside>
    </div>
    
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

export default PostDetailsPage;
