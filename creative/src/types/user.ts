// src/types/User.ts
export interface User {
    id: string;
    displayName: string;
    email: string;
    profilePicture?: string;
    role: string;
    isActive: boolean;
  }