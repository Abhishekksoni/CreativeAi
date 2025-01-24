// src/services/authService.ts
import { User } from '@/types/user';
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const authService = {
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
        console.log(error);
      return null;
    }
  },

  async logout() {
    await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true
    });
  }
};