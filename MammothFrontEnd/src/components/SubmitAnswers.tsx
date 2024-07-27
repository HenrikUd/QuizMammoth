import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext"; // Import the User context

interface SubmitAnswersProps {
  answers: any;
  uuid: string;
}

const SubmitAnswers: React.FC<SubmitAnswersProps> = ({ answers, uuid }) => {
  const apiBaseUrl = process.env.VITE_API_URL || 'http://localhost:8082';
  const navigate = useNavigate();
  const { userId } = useUser(); // Use context to get the userId
  const [answerData, setAnswerData] = useState<any>({ answers: [] });


  useEffect(() => {
    // Update the state when props change
    setAnswerData({
      answers: answers,
    });
  }, [ answers ]);

  const onSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log({ answers, uuid });
    axios
      .post(`${apiBaseUrl}/api/${userId}/answers`, { answers, uuid }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log('Answers submitted:', { ...answerData, uuid });
        console.log(res);
        // Handle the response or perform any additional actions
        navigate("/thankyou");
      })
      .catch((err) => {
        console.error("Error in CreateAnswer!", err.response);
        // Handle the error
      });
  };

  return (
    <div>
      <button type="button" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};

export default SubmitAnswers;
