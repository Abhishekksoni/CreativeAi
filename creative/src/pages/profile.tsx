import React, { useContext, useState } from 'react';
import { AuthContext } from '../components/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';

const Profile: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  // Handle post submission
  const handleCreatePost = async () => {
    if (!postTitle || !postContent) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/post', {
        title: postTitle,
        content: postContent,
        authorId: user.id,  // Sending logged-in user's ID
      },
      {
        withCredentials: true // Add this
      }
    
    );
      alert('Post created successfully!');
      setPostTitle('');
      setPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 mt-52">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage 
              src={user.profilePicture || '/default-avatar.png'} 
              alt={user.userName} 
            />
            <AvatarFallback>
              {user.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h2 className="text-2xl font-bold">{user.userName}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <div className="flex justify-between">
              <span>User ID:</span>
              <span className="text-muted-foreground">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Role:</span>
              <span className="text-muted-foreground capitalize">
                {user.role || 'Customer'}
              </span>
            </div>
          </div>

          {/* Create Post Section */}
          <div className="w-full max-w-md space-y-4 border-t pt-4">
            <h3 className="text-xl font-semibold text-center">Create a Post</h3>
            <Input 
              placeholder="Post Title" 
              value={postTitle} 
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <Textarea
              placeholder="Write your content here..." 
              value={postContent} 
              onChange={(e) => setPostContent(e.target.value)}
            />
            <Button 
              onClick={handleCreatePost} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </Button>
          </div>

          <Button onClick={logout} variant="destructive" className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
