import { useNavigate } from "react-router-dom";





const QuizForm: (props: any) => any = (props) => {


let setInputs = props.setInputs;
let inputs = props.inputs;
const navigate = useNavigate();



  const handleInput = (e: { preventDefault: () => void; }) => {     // Adds an input
    setInputs(inputs.concat(""));
    e.preventDefault();
  }

  const removeInput = (e: { preventDefault: () => void; }) => {     // Removes an input
    setInputs(inputs.slice(0, inputs.length - 1));
    e.preventDefault();
  }

  const submitForm = () => {
   navigate('quizlist')
  };

  


  return <form>

    {inputs.map((value: string, i: any) => (
      <div key={i}>
        <label>Input {i + 1}</label>
        <input type="text"
          placeholder="enter question"
          value={value}
          onChange={e =>
            setInputs(
              inputs.map((value: string, j: any) => {
                if (i === j) value = e.target.value;
                return value;
              })
            )
          }
        />
      </div>
    ))}
    <button onClick={handleInput}>Add input</button>
    <button onClick={removeInput}>Remove input</button>
    <button type="button" onClick={submitForm}>Save quiz</button>
  </form>

}


export default QuizForm