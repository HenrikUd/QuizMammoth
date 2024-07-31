import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './css/Profile.css';
import { User } from '../App'; // User types
import { useUser } from './context/UserContext';



interface Quiz {
  _id: string;
  title: string;
  url: string;
  uuid: string;
  questions: string[];
}

interface Answer {
  _id: string;
  uuid: string;
  answers: string[];
  __v: number;
}


interface ProfileProps {
  user: User | null;
  userId: string | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: Answer[] }>({});
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<{ [key: string]: boolean }>({});
  const { userId, checkAuthStatus } = useUser();
  const navigate = useNavigate();



  useEffect(() => {
    const handleRedirect = async () => {
      await checkAuthStatus(); 
      if (!userId) {
        navigate('/auth/login'); // Navigate to profile if userId is available
      }
    };

    handleRedirect();
    
    if (userId) {
      
    const fetchUserProfile = async () => {
      
        const userResponse = await axios.get(`${apiBaseUrl}/api/${userId}/quizzes/all`, { withCredentials: true });
        const quizzes: Quiz[] = userResponse.data.map((quiz: any) => ({
          ...quiz,
          questions: quiz.quizzes.questions,
        })) || [];
        setQuizzes(quizzes);

        const answersResponse = await axios.get(`${apiBaseUrl}/api/${userId}/answers/all`, { withCredentials: true });
        const rawAnswers: Answer[] = answersResponse.data || [];

        const groupedAnswers = rawAnswers.reduce((acc, answer) => {
          if (!acc[answer.uuid]) {
            acc[answer.uuid] = [];
          }
          acc[answer.uuid].push(answer);
          return acc;
        }, {} as { [key: string]: Answer[] });

        setAnswers(groupedAnswers);
    
    };

    fetchUserProfile();
}}, [userId]);

  const handleDeleteQuiz = async (quizUuid: string) => {
  
    try {
      await axios.delete(`${apiBaseUrl}/api/${userId}/quizzes`, {
        params: { uuid: quizUuid },
        withCredentials: true,
      });
      setDeleteStatus('Quiz deleted successfully');
      setQuizzes(quizzes.filter((quiz) => quiz.uuid !== quizUuid));
    } catch (error) {
      setDeleteStatus('Error deleting quiz');
      console.error('Error deleting quiz', error);
    }
  };

  const handleDeleteAnswer = async (answerUuid: string) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/${userId}/answers/`, {
        params: { uuid: answerUuid },
        withCredentials: true,
      });
      setDeleteStatus('Answer deleted successfully');
  
      // Update the answers state without refreshing the page
      setAnswers((prevAnswers) => {
        const updatedAnswers = { ...prevAnswers };
        for (const uuid in updatedAnswers) {
          updatedAnswers[uuid] = updatedAnswers[uuid].filter(answer => answer.uuid !== answerUuid);
          // Remove the quiz entirely if it has no more answers
          if (updatedAnswers[uuid].length === 0) {
            delete updatedAnswers[uuid];
          }
        }
        return updatedAnswers;
      });
  
  
    } catch (error) {
      setDeleteStatus('Error deleting answer');
      console.error('Error deleting answer', error);
    }
  };
  

  const handleCopyLink = async (quizUuid: string) => {
    const link = `${window.location.origin}/quizlist/${quizUuid}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopyStatus('Link copied to clipboard');
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (error) {
      setCopyStatus('Failed to copy link');
      console.error('Error copying link', error);
    }
  };

  const toggleShowAnswers = (uuid: string) => {
    setShowAnswers((prev) => ({
      ...prev,
      [uuid]: !prev[uuid],
    }));
  };

 

  return (
    <div className="profile-container">
      <header>
        <h1>{user?.username}'s Profile</h1>
        <p>Google ID: {user?._id}</p>
        <h2>Quizzes</h2>
        {quizzes.length > 0 ? (
          <ul>
            {quizzes.map((quiz, index) => (
              <li key={quiz._id}>
                <Link to={`/quizlist/${quiz.uuid}`}>Quiz {index + 1}: {quiz.title}</Link>
                <button onClick={() => handleDeleteQuiz(quiz.uuid)}>Delete</button>
                <button onClick={() => handleCopyLink(quiz.uuid)}>Copy Link</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No quizzes available.</p>
        )}
        {deleteStatus && <p>{deleteStatus}</p>}
        {copyStatus && <p>{copyStatus}</p>}
        <h2>Answers</h2>
        {Object.entries(answers).length > 0 ? (
          <ul>
            {Object.entries(answers).map(([uuid, answerList], index) => (
              <li key={uuid}>
                <strong className="strong">Quiz {index + 1} answers</strong>
                <button onClick={() => toggleShowAnswers(uuid)}>
                  {showAnswers[uuid] ? 'Hide Answers' : 'Show Answers'}
                </button>
                {showAnswers[uuid] && (
                  <div>
                    {answerList.map(answer => (
                    <div key={answer._id}>
                      {answer.answers.map((ans, ansIndex) => (
                        <p key={ansIndex}>
                          <strong className="strong">{quizzes.find(quiz => quiz.uuid === uuid)?.questions[ansIndex]}:</strong> {ans}
                        </p>
                      ))}
                      <button onClick={() => handleDeleteAnswer(answer.uuid)}>Delete</button>
                    </div>
                  ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No answers available.</p>
        )}
        {deleteStatus && <p>{deleteStatus}</p>}
      </header>
    </div>
  );
};

export default Profile;
