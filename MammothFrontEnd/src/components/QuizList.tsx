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

const QuizList: React.FC<QuizListProps> = (props) => {
  const { uuid } = useParams<{ uuid: string | undefined }>(); 
  const { userId } = useUser();
  const [questions, setQuestions] = useState<string[]>(props.inputs); // State for questions
  const [answers, setAnswers] = useState<string[]>(() => props.answers.length > 0 ? props.answers : Array(props.inputs.length).fill("")); // Separate state for answers

  const prevUuid = useRef<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/${userId}/quizzes/all`);
        const quizData = response.data;
        
        // Find the quiz object with the matching UUID
        const quiz = quizData.find((quiz: any) => quiz.uuid === uuid);
    
        if (quiz) {
          // Extract questions array from the quiz object
          const questions = quiz.quizzes.questions;
          setQuestions(questions);
          setAnswers(Array(questions.length).fill("")); // Initialize answers state with empty strings
          console.log(questions); 
        } else {
          console.error("Quiz not found for UUID:", uuid);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
  
    if (props.inputs.length === 0 || uuid !== prevUuid.current) {
      fetchData();
    }
  
    prevUuid.current = uuid;
  }, [uuid, props.inputs]); // Include uuid and props.inputs in the dependency array

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
        {uuid && <SubmitAnswers answers={answers} theinputs={questions} uuid={uuid}/>}
      </header>
    </div>
  );
};

export default QuizList;
