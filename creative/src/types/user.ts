// src/types/User.ts
export interface User {
    id: string;
    userName: string;
    name:string;
    email: string;
    profilePicture?: string;
    role: string;
    isActive: boolean;
  }