// import React, { useContext, useState } from 'react';
// import { AuthContext } from '../components/authContext';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Input } from '@/components/ui/input';

// import axios from 'axios';
// import { Textarea } from '@/components/ui/textarea';
// import { Navbar } from '@/components/navbar';
// import { SidebarComponent } from '@/components/sidebar';

// const Profile: React.FC = () => {
//   const { user, logout } = useContext(AuthContext);
//   const [postTitle, setPostTitle] = useState('');
//   const [postContent, setPostContent] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!user) return null;

//   // Handle post submission
//   const handleCreatePost = async () => {
//     if (!postTitle || !postContent) {
//       alert('Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post('http://localhost:8000/post', {
//         title: postTitle,
//         content: postContent,
//         authorId: user.id,  // Sending logged-in user's ID
//       },
//       {
//         withCredentials: true // Add this
//       }
    
//     );
//       alert('Post created successfully!');
//       setPostTitle('');
//       setPostContent('');
//     } catch (error) {
//       console.error('Error creating post:', error);
//       alert('Failed to create post.');
//     }
//     setLoading(false);
//   };

//   return (
//      <div className="flex flex-col h-screen relative">
//                   {/* Navbar at the top */}
//                   <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
//                   <div className="flex flex-1 mt-[60px] relative">
//                       {/* Sidebar Section */}
//                       <aside
//                           className={`fixed top-14 inset-y-0 left-0 w-64 bg-white dark:bg-black border-r transition-transform duration-300 transform
//                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
//                   lg:translate-x-0 z-40`}
//                       >
//                           <SidebarComponent />
//                       </aside>
      
//                       {/* Overlay for smaller screens */}
//                       {isSidebarOpen && (
//                           <div
//                               className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//                               onClick={() => setIsSidebarOpen(false)}
//                           ></div>
//                       )}
//                               <main
//             className="flex-1 overflow-y-auto flex-col  transition-all duration-300 lg:ml-[250px]"
//         >
//     <div className="container  p-4 mt-0 ">
//       <Card>
//         <CardHeader>
//           {/* <CardTitle>User Profile</CardTitle> */}
//         </CardHeader>
//         <CardContent className="">
//           <div className='flex flex-col justify-center items-center'>
//           <Avatar className="w-24 h-24">
//             <AvatarImage 
//               src={user.profilePicture || '/default-avatar.png'} 
//               alt={user.userName} 
//             />
//             <AvatarFallback>
//               {user.userName.charAt(0).toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//           </div>

//           <div className="text-center flex-col justify-center ">
//           <h2 className="text-2xl font-bold">{user.userName}</h2>
//             {/* <p className="text-muted-foreground">{user.email}</p> */}
//             {/* <Button onClick={logout} variant="default" className="min-w-[150px]">
//             Follow
//           </Button> */}
         
//           </div>

//           {/* <div className="grid w-full max-w-sm items-center gap-1.5">
//             <div className="flex justify-between">
//               <span>User ID:</span>
//               <span className="text-muted-foreground">{user.id}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Role:</span>
//               <span className="text-muted-foreground capitalize">
//                 {user.role || 'Customer'}
//               </span>
//             </div>
//           </div> */}

//           {/* Create Post Section
//           <div className="w-full max-w-md space-y-4 border-t pt-4">
//             <h3 className="text-xl font-semibold text-center">Create a Post</h3>
//             <Input 
//               placeholder="Post Title" 
//               value={postTitle} 
//               onChange={(e) => setPostTitle(e.target.value)}
//             />
//             <Textarea
//               placeholder="Write your content here..." 
//               value={postContent} 
//               onChange={(e) => setPostContent(e.target.value)}
//             />
//             <Button 
//               onClick={handleCreatePost} 
//               disabled={loading}
//               className="w-full"
//             >
//               {loading ? 'Creating...' : 'Create Post'}
//             </Button>
//           </div> */}
          

          
//         </CardContent>
        
//       </Card>
//     </div>
//     </main>
//      <aside className="w-1/6 min-w-[400px] border-l hidden lg:block border-gray-200 dark:border-gray-700 z-0">
//                 <div className="p-5 ml-6 mt-3 border rounded-lg max-w-[350px]">
//                     <h2 className="text-xl font-semibold">
//                     <div className="flex space-x-2">
//                         {/* {post.author.profilePicture && (
//                           <img
//                             src={post.author.profilePicture}
//                             alt={post.author.userName}
//                             className="w-8 h-8 rounded-full object-cover"
//                           />
//                         )}
//                         <span className="text-md">{post.author.userName}</span> */}
//                       </div>
//                     </h2>
//                     {/* <p className="text-gray-500">Advertise your content here.</p> */}
//                     <Button className="items-center mt-4 min-w-[300px]">Follow</Button>
//                 </div>
//             </aside>
//     </div>
//     </div>
//   );
// };

// export default Profile;

// import React, { useContext, useState } from 'react';
// import { AuthContext } from '../components/authContext';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Input } from '@/components/ui/input';
// import axios from 'axios';
// import { Textarea } from '@/components/ui/textarea';
// import { Navbar } from '@/components/navbar';
// import { SidebarComponent } from '@/components/sidebar';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@/components/ui/tabs';
// import { Label } from '@radix-ui/react-dropdown-menu';

// const Profile: React.FC = () => {
//   const { user, logout } = useContext(AuthContext);
//   const [postTitle, setPostTitle] = useState('');
//   const [postContent, setPostContent] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!user) return null;

//   // Handle post submission
//   const handleCreatePost = async () => {
//     if (!postTitle || !postContent) {
//       alert('Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         'http://localhost:8000/post',
//         {
//           title: postTitle,
//           content: postContent,
//           authorId: user.id, // Sending logged-in user's ID
//         },
//         {
//           withCredentials: true, // Add this
//         }
//       );
//       alert('Post created successfully!');
//       setPostTitle('');
//       setPostContent('');
//     } catch (error) {
//       console.error('Error creating post:', error);
//       alert('Failed to create post.');
//     }
//     setLoading(false);
//   };

//   // Dummy posts data (replace with actual data from your backend)
//   const userPosts = [
//     { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
//     { id: 2, title: 'Second Post', content: 'This is the content of the second post.' },
//   ];

//   return (
//     <div className="flex flex-col h-screen relative">
//       {/* Navbar at the top */}
//       <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

//       <div className="flex flex-1 mt-[60px] relative">
//         {/* Sidebar Section */}
//         <aside
//           className={`fixed top-14 inset-y-0 left-0 w-64 bg-white dark:bg-black border-r transition-transform duration-300 transform ${
//             isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } lg:translate-x-0 z-40`}
//         >
//           <SidebarComponent />
//         </aside>

//         {/* Overlay for smaller screens */}
//         {isSidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//             onClick={() => setIsSidebarOpen(false)}
//           ></div>
//         )}

//         {/* Main Content */}
//         <main className="flex-1 overflow-y-auto transition-all duration-300 lg:ml-[250px] p-4">
//           <div className="max-w-4xl mx-auto">
//             {/* Profile Card */}
//             <div className="bg-background rounded-lg shadow-none lg:shadow lg:border">
//               <CardHeader>
//                 {/* Profile Section */}
//                 <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
//                   {/* Avatar on the Left */}
//                   <Avatar className="w-32 h-32">
//                     <AvatarImage src={user.profilePicture || '/default-avatar.png'} alt={user.userName} />
//                     <AvatarFallback>{user.userName.charAt(0).toUpperCase()}</AvatarFallback>
//                   </Avatar>

//                   {/* User Details on the Right */}
//                   <div className="flex flex-col space-y-2">
//                     <h2 className="text-3xl font-bold">{user.userName}</h2>
//                     <p className="text-muted-foreground">{user.email}</p>
//                     <Button onClick={logout} className="min-w-[150px]">
//                       Follow
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {/* Tabs for Feed and About */}
//                 <Tabs defaultValue="feed" className="w-full lg:hidden">
//                   <TabsList className="grid w-full grid-cols-2">
//                     <TabsTrigger value="feed">Feed</TabsTrigger>
//                     <TabsTrigger value="about">About</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="feed">
//                     <Card>
//                     <div className="bg-background rounded-lg shadow-none sm:shadow sm:border">
//                       <CardHeader>
//                         <CardTitle>Feed</CardTitle>
//                         <CardDescription>Posts by {user.userName}</CardDescription>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         {userPosts.map((post) => (
//                           <div key={post.id} className="border p-4 rounded-lg">
//                             <h3 className="text-xl font-semibold">{post.title}</h3>
//                             <p className="text-muted-foreground">{post.content}</p>
//                           </div>
//                         ))}
//                       </CardContent>
//                     </div>
//                     </Card>
//                   </TabsContent>
//                   <TabsContent value="about">
//                     <Card>
//                     <div className="bg-background rounded-lg shadow-none sm:shadow sm:border">
//                       <CardHeader>
//                         <CardTitle>About</CardTitle>
//                         <CardDescription>Bio and details about {user.userName}</CardDescription>
//                       </CardHeader>
//                       <CardContent className="space-y-2">
//                         <div className="space-y-1">
//                           <Label>Bio</Label>
//                           <p className="text-muted-foreground">
//                             {user.bio || 'No bio available.'}
//                           </p>
//                         </div>
//                         <div className="space-y-1">
//                           <Label>Location</Label>
//                           <p className="text-muted-foreground">
//                             {user.location || 'No location specified.'}
//                           </p>
//                         </div>
//                       </CardContent>
//                     </div>
//                     </Card>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </div>
//           </div>
//         </main>

//         {/* Aside Section (Hidden on smaller screens) */}
//         <aside className="w-1/6 min-w-[300px] border-l hidden lg:block border-gray-200 dark:border-gray-700 z-0">
//           <div className="p-5 ml-6 mt-3 border rounded-lg max-w-[350px]">
//             <h2 className="text-xl font-semibold">Suggestions</h2>
//             <p className="text-gray-500">Advertise your content here.</p>
//             <Button className="items-center mt-4 min-w-[300px]">Follow</Button>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../components/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileUser {
  id: string;
  userName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCurrentUserProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        const idToFetch = userId || currentUser?.id;
        if (!idToFetch) {
          throw new Error("User ID not found");
        }

        // Fetch profile data
        const profileResponse = await axios.get<ProfileUser>(`http://localhost:8000/auth/profile/${idToFetch}`, {
          withCredentials: true,
        });
        setProfileUser(profileResponse.data);

        // // Fetch posts by the user
        // const postsResponse = await axios.get<Post[]>(`http://localhost:8000/post/user/${idToFetch}`, {
        //   withCredentials: true,
        // });
        // setPosts([postsResponse.data]);
        // console.log("dattttaaa", postsResponse.data)
      } catch (err) {
        console.error("Error fetching profile or posts:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [userId, currentUser?.id]);
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        const idToFetch = userId || currentUser?.id;
        if (!idToFetch) {
          throw new Error("User ID not found");
        }

        // // Fetch profile data
        // const profileResponse = await axios.get<ProfileUser>(`http://localhost:8000/auth/profile/${idToFetch}`, {
        //   withCredentials: true,
        // });
        // setProfileUser(profileResponse.data);

        // Fetch posts by the user
        const postsResponse = await axios.get<Post[]>(`http://localhost:8000/post/user/${idToFetch}`, {
          withCredentials: true,
        });
        setPosts([postsResponse.data]);
        console.log("dattttaaa", postsResponse.data)
      } catch (err) {
        console.error("Error fetching profile or posts:", err);
        // setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [userId, currentUser?.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-64 w-full mt-4 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!profileUser) {
    return <div className="max-w-4xl mx-auto p-4">User not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-14">
      {/* Profile Card */}
      <div className="bg-background rounded-lg shadow-none lg:shadow lg:border">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileUser.avatar || "/default-avatar.png"} alt={profileUser.userName} />
              <AvatarFallback>{profileUser.userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <h2 className="text-3xl font-bold">{profileUser.userName}</h2>
              <p className="text-muted-foreground">{profileUser.email}</p>
              {isCurrentUserProfile ? (
                <Button onClick={() => alert("Edit Profile clicked")} className="min-w-[150px]">
                  Edit Profile
                </Button>
              ) : (
                <Button onClick={() => alert("Follow clicked")} className="min-w-[150px]">
                  Follow
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Bio</Label>
            <p className="text-muted-foreground">{profileUser.bio || "No bio available."}</p>
          </div>
        </CardContent>
      </div>

      {/* Badges and Posts Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Badges Card */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Badges earned by {profileUser.userName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No badges available.</p>
          </CardContent>
        </Card>

        {/* Posts Card */}
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            {/* <CardDescription>Posts by {profileUser.userName}</CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="border p-4 rounded-lg">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-muted-foreground">{post.content}</p>
                  <p className="text-sm text-muted-foreground">
                    Posted on: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No posts available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;