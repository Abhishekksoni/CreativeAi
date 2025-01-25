// src/components/authContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

// Define User type
interface User {
  id: string;
  displayName: string;
  email: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {}
});

// API base URL
const API_BASE_URL = 'http://localhost:8000/auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch user profile
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/auth/profile', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Profile response:', response.data);
      setUser(response.data);
    } catch (error: any) {
      handleAuthError(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Function to handle login
  const login = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await axios.get('http://localhost:8000/auth/logout', { withCredentials: true });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Generic error handler function
  const handleAuthError = (error: any) => {
    if (axios.isAxiosError(error)) {
      console.error('Auth Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } else {
      console.error('Unexpected Error:', error);
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
