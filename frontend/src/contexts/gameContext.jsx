import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { socket } from "../services/socket";
import { useLocation } from "react-router-dom";


const GameContext = createContext(null)



export function GameProvider({ children }){
  const navigate = useNavigate()
  const [gameState, setGameState] = useState("idle")
  const [actualQuestion, setActualQuestion] = useState({})
  const [actualScore, setActualScore] = useState(0)
  const [lastIsCorrect, setLastIsCorrect] = useState(false)
  const [questionInitTime, setQuestionInitTime] = useState(Date.now())
  const [timeByQuestion, setTimeByQuestion] = useState(60)
  const [gameType, setGameType] = useState(null)
  const [room, setRoom] = useState({})
  const [numberOfAnswers, setNumberOfAnswers] = useState(0)
  const [players, setPlayers] = useState(new Map())
  const [actualQuestionIndex, setActualQuestionIndex] = useState(null)
  const [numberOfQuestions, setNumberOfQuestions] = useState(null)
  const [finishedInfo, setFinishedInfo] = useState({})

  const locations = [
    '/question',
    '/result',
    '/finished',
    '/waiting-players',
    '/creating-room-game',
    '/loading',
    '/waiting-answers',
    '/waiting-host',
  ]
  const gameStateHandler = {
    question: ()=>navigate('/question'),
    result: ()=>navigate('/result'),
    finished: ()=>navigate('/finished'),
    waitingPlayers: ()=>navigate('/waiting-players'),
    creatingRoomGame: ()=>navigate('/creating-room-game'),
    loading: ()=>navigate('/loading'),
    waitingAnswers: ()=>navigate('/waiting-answers'),
    waitingHost: ()=>navigate('/waiting-host')
  }

  function joinRoom(roomId, password = false){
    setGameState('loading')
    socket.emit('joinRoom', roomId, password)
  }
  function createRoom(name, maxOfPlayers, password=false){
    setGameState('loading')
    socket.emit('createRoom', name, maxOfPlayers, password)
  }
  function startRoomGame(numberOfQuestions, timeByQuestion, categories = false){
    setGameState('loading')
    socket.emit("startRoomGame", numberOfQuestions, timeByQuestion, categories)
  }
  function initRoomGame(){
    setGameState('loading')
    socket.emit("initRoomGame")
  }

  function playRoomAgain(){
    setGameState('loading')
    socket.emit('playRoomAgain')
  }

  function toHome(){
    if(gameType=="room"){
      socket.emit("leaveRoom")
    }
    setGameState("idle")
    navigate('/')
  }

  async function nextQuestion() {
    if(gameType=="room"){
      return
    }
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
    if(gameState=="waitingAnswers" && numberOfAnswers>=room.numberOfPlayers){
      setGameState("result")
    }
    if(locations.includes(location.pathname) && gameState == 'idle'){
      navigate('/')
    }
  }, [gameState, location.pathname]);

  useEffect(()=>{
    
    socket.on("nextQuestion",()=>{
      setNumberOfAnswers(0)
      return updateQuestion()
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
      setGameType("level")
      setGameState("question");
    })
    socket.on("gameInitialized", (res)=>{
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
      setGameType("random")
    })
    socket.on("roomCreated",()=>{
      setGameState('creatingRoomGame')
    })
    socket.on(("roomGameCreated"), (timeByQuestion,user,room)=>{
      console.log("dfkjojsdffslkj")
      setTimeByQuestion(timeByQuestion)
      setRoom(room)
      setPlayers(prev => new Map(prev).set(user.id, user));
      setGameState("waitingPlayers")
      setGameType("room")
    })
    socket.on("playerLeave", (userId)=>{
      setRoom(prev=>{
        const newRoom = {...prev}
        newRoom.numberOfPlayers--
        return newRoom
      })
      setPlayers(prev => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
      
    })

    socket.on('timeout', ()=>{
      setLastIsCorrect('timeout')
      setGameState('result')
    })
    
    socket.on("playerEnter", (user)=>{
      setRoom(prev=>{
        const newRoom = {...prev}
        newRoom.numberOfPlayers++
        return newRoom
      })
      setPlayers(prev => new Map(prev).set(user.id, user));
    })
    
    socket.on("joinedInRoom", (timeByQuestion,users,room)=>{
      setTimeByQuestion(timeByQuestion)
      setRoom(room)
      console.log(users)
      setPlayers(prev => {
        const newPlayers = new Map(prev)
        users.map((e)=>{
          newPlayers.set(e.id, e)
        })
        return newPlayers
      });
      setGameState("waitingPlayers")
      setGameType("room")
    })

    socket.on("updateNumberOfAnswers", (res)=>{
      setNumberOfAnswers(res.answereds)
    })

    socket.on("waitingAnswers", (res)=>{
      console.log(res)
      setActualScore(res.score)
      setLastIsCorrect(res.result)
      setGameState("waitingAnswers")
    })

    socket.on("finished", (res)=>{
      console.log(res)
      setFinishedInfo(res.result)
      setPlayers(new Map())
      setGameState("finished")
    })

    socket.on("waitingHost", ()=>{
      setGameState("waitingHost")
    })

    socket.on("roomClosed", ()=>{
      console.log(gameState)
      if(!['finished'].includes(gameState)){
        navigate('/')
        setGameState("idle")
      }
    })

    

    socket.on("everyoneAnswered", (res)=>{
      setActualQuestionIndex(res.currentQuestionIndex)
      setNumberOfQuestions(res.numberOfQuestions)
      setGameState("result")
      console.log("sfdkjhfdiodfhsosdfjdsfjj")
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
      timeByQuestion,
      joinRoom,
      createRoom,
      startRoomGame,
      room,
      initRoomGame,
      gameType,
      numberOfAnswers,
      actualQuestionIndex,
      numberOfQuestions,
      finishedInfo,
      playRoomAgain,
      toHome,
      players
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}