export interface Post {
  id: number;
  title: string;
  author:{userName:string, profilePicture:string};
  userName: string;
  imageUrl?: string; // Optional profile picture for the author
  likes: number;
  comments: number;
  createdAt: string;
  content: string;
  profilePicture?: string; // Optional post image
}
