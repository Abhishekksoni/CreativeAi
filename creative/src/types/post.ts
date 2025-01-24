export interface Post {
  id: number;
  title: string;
  author: string;
  authorImage?: string; // Optional profile picture for the author
  upvotes: number;
  comments: number;
  createdAt: string;
  content: string;
  image?: string; // Optional post image
}
