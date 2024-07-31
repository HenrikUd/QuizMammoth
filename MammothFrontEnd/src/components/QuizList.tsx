import { useState, useEffect, useRef } from "react";
import SubmitAnswers from "./SubmitAnswers";
import { useParams } from "react-router-dom";
import axios from "axios";
import './css/QuizList.css';
import { useUser } from "./context/UserContext";


type QuizListProps = {
  inputs: string[];
  answers: string[];
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  uuid: string | undefined;
};

interface Quiz {
  quizzes: {
    questions: string[];
  };
  _id?: string;
  userId?: string;
  uuid: string;
  __v?: number;
}

const QuizList: React.FC<QuizListProps> = (props) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const { uuid } = useParams<{ uuid: string | undefined }>(); 
  const { userId } = useUser();
  const [questions, setQuestions] = useState<string[]>(props.inputs); // State for questions
  const [answers, setAnswers] = useState<string[]>(() => props.answers.length > 0 ? props.answers : Array(props.inputs.length).fill("")); // Separate state for answers

  const prevUuid = useRef<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/${userId}/quizzes/${uuid}`, { withCredentials: true });
        console.log("Raw response data:", response.data);
        console.log("Type of response data:", typeof response.data);
  
        const data = response.data;
        
        let quiz: Quiz | undefined;
  
        if (typeof data === 'object' && data !== null) {
          if (Array.isArray(data)) {
            quiz = data.find((q): q is Quiz => 'uuid' in q && q.uuid === uuid);
          } else if ('uuid' in data && data.uuid === uuid) {
            quiz = data as Quiz;
          } else {
            // If it's an object, but not an array and not a single quiz,
            // it might be an object containing quizzes
            const quizzes = Object.values(data);
            quiz = quizzes.find((q): q is Quiz => 
              typeof q === 'object' && q !== null && 'uuid' in q && q.uuid === uuid
            );
          }
        }
  
        if (quiz && 'quizzes' in quiz && Array.isArray(quiz.quizzes.questions)) {
          const questions = quiz.quizzes.questions;
          setQuestions(questions);
          setAnswers(Array(questions.length).fill("")); 
          console.log("Found questions:", questions);
        } else {
          console.error("Quiz not found or has invalid structure for UUID:", uuid);
          console.log("Processed data:", quiz);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
      }
    };
  
    if (props.inputs.length === 0 || uuid !== prevUuid.current) {
      fetchData();
    }
  
    prevUuid.current = uuid;
  }, [uuid, props.inputs, userId, apiBaseUrl]);

  const handleInputChange = (index: number, value: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  if (questions.length === 0) {
    return null;
  }

  const myInputs = questions.map((question: string, index: number) => (
    <div key={index} className="quizlist-container">
      <header>
      {question}
      <input
        type="text"
        placeholder="answer"
        value={answers[index] || ""} // Ensure value is never undefined
        onChange={(e) => handleInputChange(index, e.target.value)}
      />
      </header>
    </div>
  ));

  return (
    <div>
      <header>
        {myInputs}
        {uuid && <SubmitAnswers answers={answers} uuid={uuid}/>}
      </header>
    </div>
  );
};

export default QuizList;
