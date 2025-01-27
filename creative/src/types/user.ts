// src/types/User.ts
export interface User {
    id: string;
    userName: string;
    email: string;
    profilePicture?: string;
    role: string;
    isActive: boolean;
  }