import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import SubmitQuiz from './SubmitQuiz';

const QuizForm: React.FC<{ setInputs: React.Dispatch<React.SetStateAction<string[]>>, inputs: string[], user: any, handleLogout: () => void }> = (props) => {
  const { setInputs, inputs } = props;
  const { userId, checkAuthStatus } = useUser();

  useEffect(() => {
    checkAuthStatus(); // checks auth status on mount
  }, []);

  if (!userId) { // login check
    return <Navigate to="/auth/login" state={{ message: 'You must be logged in to view this page' }} />;
  }

  const handleInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { // input handler
    e.preventDefault();
    setInputs(inputs.concat(""));
  };

  const removeInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { // input remove
    e.preventDefault();
    setInputs(inputs.slice(0, inputs.length - 1));
  };

  return (
    <div>
      <main>
        <form>
          {inputs.map((value, i) => (
            <div key={i}>
              <label>Question {i + 1}</label>
              <input
                type="text"
                placeholder="enter question"
                value={value}
                onChange={e =>
                  setInputs(
                    inputs.map((val, j) => (i === j ? e.target.value : val))
                  )
                }
              />
            </div>
          ))}
          <button onClick={handleInput}>Add input</button>
          <button onClick={removeInput}>Remove input</button>
          <SubmitQuiz theinputs={inputs} answers={[]} />
        </form>
      </main>
    </div>
  );
}

export default QuizForm;
