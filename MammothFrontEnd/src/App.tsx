import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import QuizForm from './components/QuizForm';
import QuizList from './components/QuizList';
import ThankYou from './components/ThankYou';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Header from './components/Header';
import { UserProvider, useUser } from './components/context/UserContext';
import { UUIDProvider } from './components/context/UuidContext';
import SubmitQuiz from './components/SubmitQuiz';
import axios from 'axios';

export interface User {
  _id: string;
  username: string;
  email: string;
  quizzes: { _id: string; title: string; url: string; uuid: string }[];
  uuid: string;
}

function App() {
  const [inputs, setInputs] = useState([""]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { userId, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      
       const fetchUserData = async () => {
         try {
           const response = await axios.get(`/api/users/${userId}`);
           setUser(response.data);
         } catch (error) {
           console.error('Error fetching user data:', error);
         }
       };
       fetchUserData();
    }
  }, [userId]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        console.log('Logged out successfully');
        navigate('/');
      } else {
        console.error('Failed to logout:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (isLoading) {
    return <div><header>Loading...</header></div>;
  }

  return (
    <UserProvider>
      <UUIDProvider>
        <div>
          <Header user={user} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/profile" element={userId ? <Profile user={user} userId={userId} /> : <Navigate to="/auth/login" />} />
            <Route path="/quizform" element={userId ? <QuizForm inputs={inputs} setInputs={setInputs} user={user} handleLogout={handleLogout} /> : <Navigate to="/auth/login" />} />
            <Route path="/quizlist/:uuid" element={<QuizList inputs={inputs} answers={answers} setAnswers={setAnswers} uuid={undefined} />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/submit-quiz" element={userId ? <SubmitQuiz theinputs={inputs} answers={answers} /> : <Navigate to="/auth/login" />} />
          </Routes>
        </div>
      </UUIDProvider>
    </UserProvider>
  );
}

export default App;
