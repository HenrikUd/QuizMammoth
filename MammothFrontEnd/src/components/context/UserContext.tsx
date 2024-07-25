import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

export interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  checkAuthStatus: () => void; // Add a function to check authentication status
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/auth/check', { withCredentials: true });
      console.log('Auth check response:', response.data);
      if (response.data.loggedIn) {
        setUserId(response.data.userId);
      } else {
        setUserId(null);
      }
    } catch (error) {
      console.error('Error checking authentication status', error);
      setUserId(null);
    }
  };

  useEffect(() => {
    checkAuthStatus(); // Check auth status on component mount
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, checkAuthStatus }}>
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
