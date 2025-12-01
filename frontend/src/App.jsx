import { Route, Routes, useLocation } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Login from './pages/login/login';
import ChooseWorlds from './pages/chooseWorlds/chooseWorlds';
import RandomQuiz from './pages/randomQuiz/randomQuiz';
import Admin from './pages/Admin/Admin';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import PrivateRoute from "./utils/PrivateRoute";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Question from './pages/Question/Question';
import RoomSelection from './pages/RoomSelection/RoomSelection';
import UserProfile from './components/UserProfile/UserProfile';
import ChooseLevel from './pages/ChosseLevel/ChooseLevel';
import { useGame } from './contexts/gameContext';
import { useAuth } from './contexts/authContext';
import Loading from './pages/Loading/Loading';


const noNavRoutes = ['/login','/create-account',]


export default function App() {
  const location = useLocation()
  const {
    nextQuestion, 
    actualScore, 
    lastIsCorrect, 
    createRoom, 
    startRoomGame, 
    room, 
    players, 
    initRoomGame, 
    numberOfAnswers,
    actualQuestionIndex,
    numberOfQuestions, 
    gameType, 
    finishedInfo,
    startLevel,
    playRoomAgain,
    toHome,
    startRandom
  } = useGame()
  const { user } = useAuth()
  const playAgainFunctions = {
    level: ()=>startLevel(finishedInfo.id),
    random: ()=>startRandom(finishedInfo.numberOfQuestions, finishedInfo.timeByQuestion, finishedInfo.categories),
    room: ()=>{playRoomAgain()}
  }
  function handleHome(){
    toHome()
  }

  return (
    <>
      <PrivateRoute>
        {!noNavRoutes.includes(location.pathname) && <NavBar />}
        
      </PrivateRoute>

      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
          } />
        <Route path="/admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
          } />
          <Route path="/loading" element={
          <PrivateRoute>
            <Loading />
          </PrivateRoute>
          } />
        <Route path="/worlds" element={
          <PrivateRoute>
            <ChooseWorlds />
          </PrivateRoute>
          } />
        <Route path="/worlds/:world" element={
          <PrivateRoute>
            <ChooseLevel />
          </PrivateRoute>
          } />
        <Route path="/question" element={
          <PrivateRoute>
            <Question />
          </PrivateRoute>
          } />
        <Route path="/result" element={
          <PrivateRoute>
            <p>Pontos: {actualScore}</p>
            <p>Resultado: {String(lastIsCorrect)}</p>
            {gameType=="room" && <div>{actualQuestionIndex+1}/{numberOfQuestions}</div>}
            <button onClick={nextQuestion}>next</button>
          </PrivateRoute>
          } />
        <Route path="/profile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
          } />
        <Route path="/room-selection" element={ 
          <PrivateRoute>
            <RoomSelection />
          </PrivateRoute>
        } />

        <Route path="/RandomQuiz" element={ 
          <PrivateRoute>
            <RandomQuiz/>
          </PrivateRoute>
        } />
        <Route path="/finished" element={ 
          <PrivateRoute>
            <div>{JSON.stringify(finishedInfo)}
              <button onClick={playAgainFunctions[gameType]}>Jogar de novo</button>
              {finishedInfo.next && <button onClick={()=>startLevel(finishedInfo.next)}>Próxima</button>}
              <button onClick={handleHome}>HomeButton</button>
            </div>
          </PrivateRoute>
        } />
        <Route path="/waiting-answers" element={ 
          <PrivateRoute>
              <div>{numberOfAnswers}/{room.numberOfPlayers}</div>
          </PrivateRoute>
        } />
        <Route path="/waiting-players" element={ 
          <PrivateRoute>
            <div>
              <p>{JSON.stringify(room)}</p>
              <p>{JSON.stringify(Array.from(players))}</p>
              {
                user?.id===room?.host && <button onClick={initRoomGame}>Iniciar</button>
              }
              
            </div>
          </PrivateRoute>
        } />
        <Route path="/creating-room" element={ 
          <PrivateRoute>
            <button onClick={()=>createRoom('sala', 20)}>Create Room</button>
          </PrivateRoute>
        } />
        <Route path="/creating-room-game" element={ 
          <PrivateRoute>
            <button onClick={()=>startRoomGame(3, 7)}>Create Room Game</button>
            
          </PrivateRoute>
        } />

        <Route path="/login" element={<Login />} />
      </Routes>

      <Toaster position='top-right' toastOptions={{style:{fontSize: "2.4rem"}}}></Toaster>
    </>
  );
}