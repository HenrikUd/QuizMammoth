import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './context/UserContext';
import { Navigate, useLocation } from 'react-router-dom';
import './css/Profile.css';

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

interface User {
  _id: string;
  username: string;
  email: string;
  quizzes: Quiz[];
  uuid: string;
  userId: string | null;
}

interface ProfileProps {
  user: User | null;
  userId: string | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { userId } = useUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: Answer[] }>({});
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<{ [key: string]: boolean }>({});
  const location = useLocation(); 


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) {
          return;
        }
        const userResponse = await axios.get(`http://localhost:8082/api/${userId}/quizzes/all`);
        const quizzes: Quiz[] = userResponse.data.map((quiz: any) => ({
          ...quiz,
          questions: quiz.quizzes.questions,
        })) || [];
        setQuizzes(quizzes);

        const answersResponse = await axios.get(`http://localhost:8082/api/${userId}/answers/all`);
        const rawAnswers: Answer[] = answersResponse.data || [];

        const groupedAnswers = rawAnswers.reduce((acc, answer) => {
          if (!acc[answer.uuid]) {
            acc[answer.uuid] = [];
          }
          acc[answer.uuid].push(answer);
          return acc;
        }, {} as { [key: string]: Answer[] });

        setAnswers(groupedAnswers);
      } catch (error) {
        console.error('Error fetching user profile, quizzes, or answers', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleDeleteQuiz = async (quizUuid: string) => {
  
    try {
      await axios.delete(`http://localhost:8082/api/${userId}/quizzes`, {
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
      await axios.delete(`http://localhost:8082/api/${userId}/answers/`, {
        params: { uuid: answerUuid },
        withCredentials: true,
      });
      setDeleteStatus('Answer deleted successfully');
      window.location.reload();

  
      // Update the answers state
      setAnswers((prevAnswers) => {
        const updatedAnswers = { ...prevAnswers };
        for (const uuid in updatedAnswers) {
          updatedAnswers[uuid] = updatedAnswers[uuid].filter(answer => answer.uuid !== answerUuid);
        }
        return updatedAnswers;
      });
    } catch (error) {
      setDeleteStatus('Error deleting answer');
      console.error('Error deleting answer', error);
    }
  };
  

  const handleCopyLink = async (quizUuid: string) => {
    const link = `${window.location.origin}/#/quizlist/${quizUuid}`;
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

  if (!userId) {
    return <Navigate to="/auth/login" state={{ from: location, message: 'You must be logged in to view this page' }} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

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
                <a href={`#/quizlist/${quiz.uuid}`}>Quiz {index + 1}: {quiz.title}</a>
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
