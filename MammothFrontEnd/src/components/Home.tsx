import React, { useEffect } from 'react';
import { useUser } from './context/UserContext'; 
import './css/Home.css';

const Home: React.FC = () => {
  const { userId, checkAuthStatus } = useUser();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    fetchHomeData();
  }, []);





  return (
    <div>
      <header>
        <h1>Welcome to QuizMammoth</h1>
      </header>
      <main>
        {userId ? (
          <div>
            <p>Welcome!</p>
          </div>
        ) : (
          <p>QuizMammoth is your easy to use quiz app. Just log in, create your quiz and share it with your friends.</p>
        )}
      </main>
    </div>
  );
};

export default Home;
