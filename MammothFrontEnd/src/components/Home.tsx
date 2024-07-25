import React, { useState, useEffect } from 'react';
import { useUser } from './context/UserContext'; 
import './css/Home.css';

const Home: React.FC = () => {
  const { userId, setUserId, checkAuthStatus } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Error checking authentication status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [checkAuthStatus]);



  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header>
        <h1>Welcome to QuizMammoth</h1>
      </header>
      <main>
        {userId ? (
          <div>
            <p>Welcome, user {userId}!</p>
          </div>
        ) : (
          <p>QuizMammoth is your easy to use quiz app. Just log in, create your quiz and share it with your friends.</p>
        )}
      </main>
    </div>
  );
};

export default Home;
