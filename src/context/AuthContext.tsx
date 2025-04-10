
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('campusVoiceUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would connect to a backend
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response based on email
      let mockUser: User;
      
      if (email === 'admin@campus.com') {
        mockUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@campus.com',
          role: 'admin',
        };
      } else {
        mockUser = {
          id: '2',
          name: 'Student User',
          email,
          role: 'student',
        };
      }
      
      // Store user in localStorage and context
      localStorage.setItem('campusVoiceUser', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error', error);
      throw new Error('Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role: 'student',
      };
      
      localStorage.setItem('campusVoiceUser', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Registration error', error);
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('campusVoiceUser');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
