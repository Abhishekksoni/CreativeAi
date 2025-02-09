// src/components/authContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import axios from 'axios';

// Define User type
interface User {
  id: string;
  userName: string;
  name: string;
  profilePicture: string;
  email: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<User>) => void; // ✅ Add updateUser function
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  updateUser: () => {}, // ✅ Provide a default empty function
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/auth/profile', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      setUser(response.data);
    } catch (error: unknown) {
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

  // ✅ Function to update user state partially
  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedFields } : prevUser));
  };

  // Generic error handler function
  const handleAuthError = (error: unknown) => {
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
