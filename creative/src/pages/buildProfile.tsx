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
import creativeAiLogo from "@/assets/creativeAi.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProfileData {
  userName: string;
  bio: string;
}

const ProfileBuilder: React.FC = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [profileData, setProfileData] = useState<ProfileData>({
    userName: "",
    bio: "",
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sliderRef = React.useRef<Slider>(null);

  const steps = [
    { title: "Basic Info", description: "Set up your username and bio" },
    { title: "Discover", description: "Find people to follow" },
    { title: "Complete", description: "Finish your profile setup" }
  ];

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/auth/profile/${userId}`,
        {
          userName: profileData.userName,
          bio: profileData.bio,
        },
        { withCredentials: true }
      );

      if (response) {
        toast.success("Profile saved successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error("Failed to save profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentStep(newIndex);
    },
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
    <div className="min-h-screen dark:bg-[#030712] from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-0">
            <img
              src={creativeAiLogo}
              alt="CreativeAI Logo"
              className="h-24 w-auto object-contain dark:invert dark:brightness-200"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-0">
            Welcome to CreativeAI
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's set up your profile to get started
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs text-center">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <Slider ref={sliderRef} {...settings}>
            {/* Step 1: Username and Bio */}
            <div className="px-2">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tell us about yourself
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Choose a unique username and share your story
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={profileData.userName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, userName: e.target.value })
                      }
                      className="h-12 text-lg border-2 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your username"
                    />
                    {isCheckingUsername && (
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-1">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Checking availability...
                      </div>
                    )}
                    {!isCheckingUsername && isUsernameAvailable === false && (
                      <div className="flex items-center text-sm text-red-500 mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Username is not available
                      </div>
                    )}
                    {!isCheckingUsername && isUsernameAvailable === true && (
                      <div className="flex items-center text-sm text-green-500 mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Username is available!
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      className="min-h-[120px] text-lg border-2 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      placeholder="Tell us about yourself, your interests, or what you're passionate about..."
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {profileData.bio.length}/500 characters
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleNext}
                    disabled={
                      !profileData.userName ||
                      isUsernameAvailable === false ||
                      isCheckingUsername
                    }
                    className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Suggested Follows */}
            <div className="px-4">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Discover Amazing Creators
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Follow people who share your interests
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                          AI
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">AI Enthusiasts</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Connect with AI developers and researchers</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          Follow
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium">
                          CR
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">Creative Minds</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Artists, designers, and innovators</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          Follow
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-medium">
                          TE
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">Tech Explorers</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Developers and tech enthusiasts</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          Follow
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleNext}
                    className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Step 3: Complete Setup */}
            <div className="px-4">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    You're All Set!
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Your profile is ready. Let's start creating amazing content!
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Welcome to CreativeAI!
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You can now create posts, connect with others, and explore the community.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Create and share posts</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Connect with other creators</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Explore trending content</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Setting up your profile...
                      </div>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ProfileBuilder;