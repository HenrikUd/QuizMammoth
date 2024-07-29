import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  checkAuthStatus: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      console.log(apiBaseUrl)
      const response = await axios.get(`api/auth/check`, { withCredentials: true });
      console.log('Auth check response:', response.data);
      if (response.data.loggedIn) {
        setUserId(response.data.userId);
      } else {
        setUserId(null);
      }
    } catch (error) {
      console.error('Error checking authentication status', error);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus(); // Check auth status on component mount
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, checkAuthStatus, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
