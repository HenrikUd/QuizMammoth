import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import SubmitAnswers from "./SubmitAnswers";
import { useUUID } from "./context/UuidContext"; // Use UUID context
import { useUser } from "./context/UserContext";

interface SubmitQuizProps {
  theinputs: string[];
  answers: string[];
}

const SubmitQuiz: React.FC<SubmitQuizProps> = ({ theinputs, answers }) => {
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082';
  const navigate = useNavigate();
  const { setUuid } = useUUID(); // Use context to set the UUID
  const { userId } = useUser();
  const [quizzes, setQuizzes] = useState<{ questions: string[] }>({ questions: [] });
  const [uuid, setLocalUuid] = useState<string | null>(null); // Local state to hold the UUID

  useEffect(() => {
    setQuizzes({ questions: theinputs });
  }, [theinputs]);

  const submitQuiz = async () => {
    const generatedUuid = uuidv4();
    setUuid(generatedUuid);
    setLocalUuid(generatedUuid);
  
    try {
      console.log("Submitting quiz with UUID:", generatedUuid);
      console.log("Questions:", quizzes);
  
      const response = await axios.post(`${apiBaseUrl}/api/${userId}/quizzes`, {
        uuid: generatedUuid,
        quizzes
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log('Quiz submitted', response.data);
      navigate(`/thankyou`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error saving quiz:', error.response || error.message);
      } else {
        console.error('Unexpected error saving quiz:', error);
      }
    }
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    submitQuiz();
  };

  return (
    <div>
      <button type="button" onClick={onSubmit}>
        Submit Quiz
      </button>
      {uuid && <SubmitAnswers answers={answers} uuid={uuid} />}
    </div>
  );
};

export default SubmitQuiz;
