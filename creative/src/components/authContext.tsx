// src/components/authContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
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
  logout: () => void;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/auth/profile', {
          withCredentials: true
          
        });
        console.log('Profile response:', response.data); 
        setUser(response.data);
      } catch (error) {
        console.log(error)
        console.error('Auth check failed:', error.response?.data || error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:8000/auth/logout', {
        withCredentials: true
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // If loading, you might want to return a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};