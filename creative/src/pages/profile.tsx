// src/pages/Profile.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../components/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 mt-52">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage 
              // src={user.photos || '/default-avatar.png'} 
              alt={user.displayName} 
            />
            <AvatarFallback>
              {user.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
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

          <Button onClick={logout} variant="destructive" className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;