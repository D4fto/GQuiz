import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { socket } from "../services/socket";


const GameContext = createContext(null)


export function GameProvider({ children }){
  const navigate = useNavigate()
  const [gameState, setGameState] = useState("idle")
  const [actualQuestion, setActualQuestion] = useState({})
  const [actualScore, setActualScore] = useState(0)
  const [lastIsCorrect, setLastIsCorrect] = useState(false)
  const [questionInitTime, setQuestionInitTime] = useState(Date.now())
  const [timeByQuestion, setTimeByQuestion] = useState(60)

  const gameStateHandler = {
    question: ()=>navigate('/question'),
    result: ()=>navigate('/result'),
    finished: ()=>navigate('/finished'),
    loading: ()=>navigate('/loading')
  }

  async function nextQuestion() {
    setGameState('loading')
    socket.emit('nextQuestion')
  }
  async function updateQuestion() {
    setGameState('loading')
    socket.emit('actualQuestion')
  }
  async function startLevel(id) {
    setGameState('loading')
    socket.emit("startLevel", id)
  }
  async function startRandom(numberOfQuestions, timeByQuestion, categories = false) {
    numberOfQuestions = parseInt(numberOfQuestions)
    timeByQuestion = parseInt(timeByQuestion)
    setGameState('loading')
    socket.emit("startRandom", numberOfQuestions, timeByQuestion, categories)
  }
  async function answerQuestion(id) {
    setGameState('loading')
    socket.emit("answerQuestion",id)
  }

  useEffect(() => {
    const gameStateHandlerFunction =  gameStateHandler[gameState]
    if(gameStateHandlerFunction){
      gameStateHandlerFunction()
    }
  }, [gameState]);

  useEffect(()=>{
    socket.on("nextQuestion",(res)=>{
      if(res.result){
        return updateQuestion()
      }
      return setGameState("finished");
    })
    socket.on("actualQuestion",(res)=>{
      setActualQuestion(res.question)
      setTimeByQuestion(res.timeByQuestion)
      setQuestionInitTime(res.time)
      return setGameState("question")
    })
    socket.on("startLevel", (res)=>{
      setQuestionInitTime(res.time)
      setTimeByQuestion(res.timeByQuestion)
      setActualQuestion(res.question)
      setGameState("question");
    })
    socket.on("answerQuestion", (res)=>{
      setActualScore(res.score)
      setLastIsCorrect(res.result)
      setGameState("result");
    })
    socket.on("startRandom",(res)=>{
      setQuestionInitTime(res.time)
      setTimeByQuestion(res.timeByQuestion)
      setActualQuestion(res.question)
      setGameState("question");
    })
    // socket.emit('createRoom', "sala", 20)
    socket.on("createRoom",(roomId)=>{
      socket.emit("startRoomGame", roomId)
    })
  },[])

  return (
    <GameContext.Provider value={{ 
      gameState, 
      startLevel, 
      startRandom, 
      actualQuestion, 
      answerQuestion, 
      nextQuestion, 
      actualScore, 
      lastIsCorrect,
      questionInitTime,
      timeByQuestion
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}