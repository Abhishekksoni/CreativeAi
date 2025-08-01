import { AuthContext } from "@/components/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/components/aws";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type EducationWorkEntry = {
  id?: string;
  institution: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  type: 'education' | 'work';
};

const EditProfilePage: React.FC = () => {
  const { user, updateUser, refreshUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Profile State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');

  // Education & Work State
  const [entries, setEntries] = useState<EducationWorkEntry[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes] = await Promise.all([
          axios.get(`/auth/profile/${user?.id}`),
        ]);

        setUsername(profileRes.data.userName);
        setEmail(profileRes.data.email);
        setBio(profileRes.data.bio);
        setProfileImagePreview(profileRes.data.profilePicture);
        // setEntries(entriesRes.data);
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchProfileData();
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEntryChange = (index: number, field: keyof EducationWorkEntry, value: string | boolean) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setEntries(updatedEntries);
  };

  const addNewEntry = (type: 'education' | 'work') => {
    setEntries([...entries, {
      institution: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      type
    }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      let profilePictureUrl = profileImagePreview;
      
      // If there's a new profile image, upload it to S3 first
      if (profileImage) {
        setIsUploadingImage(true);
        const uploadedUrl = await uploadImage(profileImage);
        setIsUploadingImage(false);
        
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl;
        } else {
          toast.error('Failed to upload profile picture');
          setIsSubmitting(false);
          return;
        }
      }

      const data = {
        userName: username,
        email: email,
        bio: bio,
        profilePicture: profilePictureUrl
      };
  
      const profileRes = await axios.put(
       ` http://localhost:8000/auth/profile/${user?.id}`, 
        data, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Refresh user data from server to get the latest profile picture
      await refreshUser();
      
      toast.success('Profile updated successfully!');
      
      // Clear the profile image state after successful upload
      setProfileImage(null);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center mt-8">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 ">
      <ToastContainer />
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={profileImagePreview || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  {profileImage && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-background p-1 rounded-full border cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="sr-only">Upload profile picture</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                </div>
                {profileImage && (
                  <div className="text-sm text-gray-600">
                    <p>Selected: {profileImage.name}</p>
                    <p className="text-xs text-gray-500">Image will be uploaded when you save</p>
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <Label>Username</Label>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                 <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                 <Label>Bio</Label>
                <Textarea
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Education & Work Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Education & Work Experience</CardTitle>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addNewEntry('education')}
                  >
                    Add Education
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addNewEntry('work')}
                  >
                    Add Work
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {entries.map((entry, index) => (
                <div key={index} className="space-y-4 border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium capitalize">{entry.type}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntry(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                    //   label={entry.type === 'education' ? 'Institution' : 'Company'}
                      value={entry.institution}
                      onChange={(e) => handleEntryChange(index, 'institution', e.target.value)}
                      required
                    />
                    <Input
                    //   label={entry.type === 'education' ? 'Degree/Program' : 'Position'}
                      value={entry.position}
                      onChange={(e) => handleEntryChange(index, 'position', e.target.value)}
                      required
                    />
                    <Input
                      type="date"
                    //   label="Start Date"
                      value={entry.startDate}
                      onChange={(e) => handleEntryChange(index, 'startDate', e.target.value)}
                      required
                    />
                    {!entry.isCurrent ? (
                      <Input
                        type="date"
                        // label="End Date"
                        value={entry.endDate}
                        onChange={(e) => handleEntryChange(index, 'endDate', e.target.value)}
                        disabled={entry.isCurrent}
                      />
                    ) : null}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={entry.isCurrent}
                        onChange={(e) => handleEntryChange(index, 'isCurrent', e.target.checked)}
                      />
                      <label htmlFor={`current-${index}`} className="text-sm">
                        Currently {entry.type === 'education' ? 'studying' : 'working'} here
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting || isUploadingImage}
          >
            {isUploadingImage ? 'Uploading Image...' : isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;