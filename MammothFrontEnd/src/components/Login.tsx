import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../components/context/UserContext';
import { googleAuth } from '../components/authService';

const Login: React.FC = () => {
  const { userId, checkAuthStatus } = useUser();

  useEffect(() => {
    checkAuthStatus(); // ensures auth status is checked on mount
  }, []);

  const handleGoogleLogin = () => {
    googleAuth(); // redirects to Google OAuth
  };

  if (userId) { // if user is already logged in, redirects to profile
    return <Navigate to="/profile" />;
  }

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
