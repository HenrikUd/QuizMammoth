import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';

interface HeaderProps {
  user: any;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout }) => {
  return (
    <nav>
      <ul>
        {user ? (
          <li><a onClick={handleLogout}>Log out</a></li>
        ) : (
          <li><Link to="/auth/login">Login</Link></li>
        )}
        <li><Link to="/">Homepage</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/quizform">Create Quiz</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
