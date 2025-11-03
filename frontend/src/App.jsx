import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/login/login';
import ChooseWorlds from './pages/chooseWorlds/chooseWorlds';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';

const noNavRoutes = ['/login']

export default function App() {
  const location = useLocation()

  return (
    <>

      {!noNavRoutes.includes(location.pathname) && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/worlds" element={<ChooseWorlds />} />
      </Routes>
    </>
  );
}