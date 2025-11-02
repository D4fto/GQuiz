import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import ChooseWorlds from './pages/chooseWorlds/chooseWorlds';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';

export default function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/worlds" element={<ChooseWorlds />} />
      </Routes>
    </>
  );
}