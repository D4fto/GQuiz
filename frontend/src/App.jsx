import { Route, Routes, useLocation } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Login from './pages/login/login';
import ColorQuestion from './pages/QuickTimeEvent/ColorQuestion';
import QuickTimeEvent from './pages/QuickTimeEvent/QuickTimeEvent';
import ChooseWorlds from './pages/chooseWorlds/chooseWorlds';
import RandomQuiz from './pages/randomQuiz/randomQuiz';
import RoomCreation from './pages/roomCreation/roomCreation';
import RoomCreationPt2 from './components/RoomCreationPt2/RoomCreationPt2'
import EditProfile from './components/EditProfile/EditProfile';
import Finished from './pages/finished/finished'
import Admin from './pages/Admin/Admin';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import PrivateRoute from "./utils/PrivateRoute";
import { useEffect } from "react";
import WaitingHost from './pages/WaitingHost/WaitingHost';
import WaitingAnswers from './pages/WaitingAnswers/WaitingAnswers';
import { Toaster } from "react-hot-toast";
import Question from './pages/Question/Question';
import RoomSelection from './pages/RoomSelection/RoomSelection';
import UserProfile from './components/UserProfile/UserProfile';
import ChooseLevel from './pages/ChosseLevel/ChooseLevel';
import { useGame } from './contexts/gameContext';
import { useAuth } from './contexts/authContext';
import Loading from './pages/Loading/Loading';
import Result from './pages/Result/Result';
import Waiting from './pages/Waiting/Waiting';


const noNavRoutes = ['/login','/create-account',]


export default function App() {
  const location = useLocation()
  const {
    room, 
    players, 
    initRoomGame, 
    
    quickTimeEvent,
  } = useGame()
  const { user } = useAuth()
  

  const quickTimeEventPages = {
    "word": <QuickTimeEvent/>,
    "color": <ColorQuestion/>
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
          <Route path="/time" element={
          <PrivateRoute>
            <QuickTimeEvent />
          </PrivateRoute>
          } />
          <Route path="/color" element={
          <PrivateRoute>
            <ColorQuestion />
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
            <Result/>
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

        <Route path="/edit-profile" element={ 
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        } />

        <Route path="/RandomQuiz" element={ 
          <PrivateRoute>
            <RandomQuiz/>
          </PrivateRoute>
        } />

        <Route path="/RoomCreation" element={ 
          <PrivateRoute>
            <RoomCreation/>
          </PrivateRoute>
        } />

        <Route path="/quickTimeEvent" element={ 
          <PrivateRoute>
            {
              quickTimeEventPages[quickTimeEvent.type]
            }
          </PrivateRoute>
        } />

        <Route path="/RoomCreationPt2" element={ 
          <PrivateRoute>
            <RoomCreationPt2/>
          </PrivateRoute>
        } />

        <Route path="/finished" element={ 
          <PrivateRoute>
            {/* <div>{JSON.stringify(finishedInfo)}
              <button onClick={playAgainFunctions[gameType]}>Jogar de novo</button>
              {finishedInfo.next && <button onClick={()=>startLevel(finishedInfo.next)}>Próxima</button>}
              <button onClick={handleHome}>HomeButton</button>
            </div> */}
           <Finished/>
          </PrivateRoute>
        } />
        <Route path="/waiting-answers" element={ 
          <PrivateRoute>
              <WaitingAnswers></WaitingAnswers>
          </PrivateRoute>
        } />
        <Route path="/waiting-host" element={ 
          <PrivateRoute>
              <WaitingHost></WaitingHost>
          </PrivateRoute>
        } />
        <Route path="/waiting-players" element={ 
          <PrivateRoute>
            <Waiting/>
            {/* <div>
              <p>{JSON.stringify(room)}</p>
              <p>{JSON.stringify(Array.from(players))}</p>
              {
                user?.id===room?.host && <button onClick={initRoomGame}>Iniciar</button>
              }
              
            </div> */}
          </PrivateRoute>
        } />

        <Route path="/login" element={<Login />} />
      </Routes>

      <Toaster position='top-right' toastOptions={{style:{fontSize: "2.4rem"}}}></Toaster>
    </>
  );
}