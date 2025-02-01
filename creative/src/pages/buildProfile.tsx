import React, { useContext, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "@/components/authContext";

interface ProfileData {
  userName: string;
  bio: string;
  // subscribeToNewsletter: boolean;
}

const ProfileBuilder: React.FC = () => {
  // const params = useParams();
  // const userId = params.userId;
  const {user} = useContext(AuthContext)
  const userId = user?.id;
  const [profileData, setProfileData] = useState<ProfileData>({
    userName: "",
    bio: "",
    // subscribeToNewsletter: false,
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const sliderRef = React.useRef<Slider>(null);

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handleSubmit = async () => {

    try {
      const response = await axios.post(`http://localhost:8000/auth/profile/${userId}`, 
        { 
          userName: profileData.userName,
        bio: profileData.bio,
        },
      { withCredentials: true }
    );

      if (response) {
        alert("Profile saved successfully!");
        // Redirect to the home page or dashboard
        window.location.href = "/";
      } else {
        alert("Failed to save profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  React.useEffect(() => {
    const checkUsernameAvailability = async () => {
      const username = profileData.userName.trim();
      
      if (!username || !userId) {
        setIsUsernameAvailable(null);
        return;
      }
  
      setIsCheckingUsername(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/auth/check-username/${userId}/${username}`,
          { withCredentials: true }
        );
        setIsUsernameAvailable(response.data.available);
      } catch (error) {
        console.error('Error checking username:', error);
        setIsUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    };
  
    const debounceTimer = setTimeout(checkUsernameAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [profileData.userName, userId]);

  return (
    <div className="max-w-md mx-auto p-4 mt-16">
      <Slider ref={sliderRef} {...settings}>
        {/* Step 1: Username and Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Build Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            <div>
  <Label htmlFor="username">Username</Label>
  <Input
    id="username"
    value={profileData.userName}
    onChange={(e) =>
      setProfileData({ ...profileData, userName: e.target.value })
    }
  />
  {isCheckingUsername && (
    <p className="text-sm text-muted-foreground mt-1">Checking availability...</p>
  )}
  {!isCheckingUsername && isUsernameAvailable === false && (
    <p className="text-sm text-red-500 mt-1">Username is not available</p>
  )}
  {!isCheckingUsername && isUsernameAvailable === true && (
    <p className="text-sm text-green-500 mt-1">Username is available!</p>
  )}
</div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                />
              </div>
              <Button 
  onClick={handleNext}
  disabled={
    !profileData.userName ||
    isUsernameAvailable === false ||
    isCheckingUsername
  }
>
  Next
</Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Suggested Follows */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested Follows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Here are some users you might want to follow:</p>
              {/* Add a list of suggested users here */}
              <Button onClick={handleNext}>Next</Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Stay Informed */}
        <Card>
          <CardHeader>
            <CardTitle>Stay Informed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {/* <Checkbox
                  id="newsletter"
                  checked={profileData.subscribeToNewsletter}
                  onCheckedChange={(checked) =>
                    setProfileData({
                      ...profileData,
                      subscribeToNewsletter: !!checked,
                    })
                  }
                /> */}
                <Label htmlFor="newsletter">
                  Subscribe to CreativeAI Newsletter
                </Label>
              </div>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </CardContent>
        </Card>
      </Slider>
    </div>
  );
};

export default ProfileBuilder;