import './App.css'
import QuizForm from './components/QuizForm'
import QuizList from './components/QuizList'
import { Routes, Route } from 'react-router-dom'
import { useState } from "react";


function App() {

 
  
  let [inputs, setInputs] = useState([""])
  let [savedInput, setSavedInputs] = useState([""])
  
  return (
    <>
    
    <Routes>
      <Route index element={<QuizForm inputs = {inputs} setInputs = {setInputs} savedInput = {savedInput} setSavedInputs = {setSavedInputs} />}/>
      <Route path="/quizlist" element={<QuizList inputs = {inputs}/>} />
      </Routes>
      
    </>
  )
}

export default App
