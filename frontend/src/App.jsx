import { Route, Routes, useLocation } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Login from './pages/login/login';
import ChooseWorlds from './pages/ChooseWorlds/chooseWorlds';
import Admin from './pages/Admin/Admin';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import PrivateRoute from "./utils/PrivateRoute";

import { Toaster } from "react-hot-toast";
import Question from './pages/Question/Question';
import RoomSelection from './pages/RoomSelection/RoomSelection';
import UserProfile from './components/UserProfile/UserProfile';
import ChooseLevel from './pages/ChosseLevel/ChooseLevel';
import { useGame } from './contexts/gameContext';


const noNavRoutes = ['/login','/create-account']


export default function App() {
  const location = useLocation()
  const {nextQuestion, actualScore, lastIsCorrect} = useGame()


  return (
    <>


        {!noNavRoutes.includes(location.pathname) && <NavBar />}

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
          <Route path="/login" element={<Login />} />
        </Routes>

        <Toaster position='top-right' toastOptions={{style:{fontSize: "2.4rem"}}}></Toaster>
    </>
  );
}