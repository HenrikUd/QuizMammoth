import React, { useEffect } from 'react';
import { googleAuth } from '../components/authService';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/context/UserContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { userId, checkAuthStatus } = useUser();

  useEffect(() => {
    // Define a function to handle the redirection
    const handleRedirect = async () => {
      await checkAuthStatus(); // Ensure the auth status is updated
      if (userId) {
        navigate('/profile'); // Navigate to profile if userId is available
      }
    };

    handleRedirect();
  }, [userId, checkAuthStatus, navigate]);

  const handleGoogleLogin = () => {
    googleAuth(); // Redirect to Google OAuth
  };

  return (
    <div>
      <header>
        <h1>Login using...</h1>
        <button onClick={handleGoogleLogin}>Google+</button>
      </header>
    </div>
  );
};

export default Login;
