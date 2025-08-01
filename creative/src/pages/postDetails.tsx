import { CommentSection } from "@/components/comments";
import { Icons } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { SidebarComponent } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import creativeAiLogo from "@/assets/creativeAi.png"; 




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
  const [post, setPost] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

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
      console.log('Post author data:', response.data.author);
    });

    axios.get(`http://localhost:8000/comment/${postId}`).then((response) => {
      setComments(response.data);
    });
  }, [postId]);

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
                  {/* <span className="text-xs text-gray-400">{timeAgo}</span> */}
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
                
                        {/* Save Icon */}
                        <div className="cursor-pointer hover:text-gray-800">
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
</div>
  );
};

export default PostDetailsPage;
