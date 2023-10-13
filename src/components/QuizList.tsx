import { useState, useEffect } from "react";


const QuizList: (props: any) => any = (props) => {
  
let [send, setSend] = useState(false);
  
console.log(send)
  function DisplayList () { 

     if (props.inputs[0] === undefined) {
    return null;
  } if (props.inputs[0] !== "") {
   return props.inputs.map((inputs: any) => 
   <div>
   {inputs}
   <input type="text" />
   
   </div>
     
   )
    
  } 
  
}
function SubmitList () {
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      setSend(true)
    }
    finally {
      console.log('all gucci my wigga')
    }
  }
 
  return (
  
  <button type="submit" onClick={handleSubmit}>Save and submit quiz</button>
 
  )
  
}
return (
  
    <>
  <DisplayList />
  <SubmitList />
  </>
)
};




  


export default QuizList