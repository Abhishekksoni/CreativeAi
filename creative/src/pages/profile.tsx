
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../components/authContext";
import { Post } from "@/types/post";
import PostCard from "@/components/postCard";

interface ProfileUser {
  id: string;
  userName: string;
  name: string;
  work:string,
  education:string,
  email: string;
  profilePicture?: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
// }

const Profile: React.FC = () => {
  const params = useParams();
  const userId = params.userId;
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
        const idToFetch = userId ?? currentUser?.id;
if (!idToFetch) {
  setError("User ID not found.");
  return;
}
  
        // Fetch profile data and posts in parallel
        const [profileResponse, postsResponse] = await Promise.all([
          axios.get<ProfileUser>(`http://localhost:8000/auth/profile/${idToFetch}`, { withCredentials: true }),
          axios.get<Post[]>(`http://localhost:8000/post/user/${idToFetch}`, { withCredentials: true }),
        ]);
  
        setProfileUser(profileResponse.data);
        console.log("asdfa", profileResponse.data);
  
        setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : [postsResponse.data]);
        console.log("dattttaaa", postsResponse.data);
      } catch (err) {
        console.error("Error fetching profile or posts:", err);
        setError("Failed to load profile data. Please try again later.");
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
              <AvatarImage src={profileUser.avatar || "/default-avatar.png"} alt={profileUser.name} />
              <AvatarFallback>{profileUser.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <h2 className="text-3xl font-bold">{profileUser.name}</h2>
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
  {/* Bio Section (Conditional) */}
  {profileUser.bio && (
    <div className="space-y-2">
      <Label>Bio</Label>
      <p className="text-muted-foreground">{profileUser.bio}</p>
    </div>
  )}

  {/* Education, Work, and Other Sections (Conditional) */}
  <div className="flex justify-between space-y-2 mt-8">
    {/* Education Section */}
    {profileUser.education && (
      <div>
        <Label>Education</Label>
        <p className="text-muted-foreground">{profileUser.education}</p>
      </div>
    )}

    {/* Work Section */}
    {profileUser.work && (
      <div>
        <Label>Work</Label>
        <p className="text-muted-foreground">{profileUser.work}</p>
      </div>
    )}
  </div>
</CardContent>
      </div>

{/* Badges and Posts Cards */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
  {/* Badges Card */}
  <Card className="h-fit">
    <CardHeader>
      <CardTitle>Badges</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 ml-10">
        {/* Example Badge Images */}
        <img
          src="https://media2.dev.to/dynamic/image/width=180,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fbadge%2Fbadge_image%2F280%2FWriting_Streak_Badges-05.png"
          alt="Badge 1"
          className="w-16 h-16 object-cover rounded-full"
        />
        <img
          src="https://preview.redd.it/fsx0sxlz96pd1.png?width=500&height=500&crop=smart&auto=webp&s=d06d8e447b1be9eba7ad045af88b30283669f3a8"
          alt="Badge 2"
          className="w-16 h-16 object-cover rounded-full"
        />
        <img
          src="https://media2.dev.to/dynamic/image/width=180,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fbadge%2Fbadge_image%2F355%2Fbadge-1.png"
          alt="Badge 3"
          className="w-16 h-16 object-cover rounded-full"
        />
        <img
          src="https://media2.dev.to/dynamic/image/width=180,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fbadge%2Fbadge_image%2F280%2FWriting_Streak_Badges-05.png"
          alt="Badge 4"
          className="w-16 h-16 object-cover rounded-full"
        />
      </div>
    </CardContent>
  </Card>

   {/* Posts Card */}
   <Card className="h-fit shadow-none border-none bg-transparent">
   <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id}  post={post} />)
        ) : (
          <div>No posts available</div>
        )}
      </div>
  </Card>
</div>

    </div>
  );
};

export default Profile;