import { Route, Routes, useLocation } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Login from './pages/login/login';
import ChooseWorlds from './pages/chooseWorlds/chooseWorlds';
import Admin from './pages/Admin/Admin';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar/NavBar';
import PrivateRoute from "./utils/PrivateRoute";
import { Providers } from './contexts/Providers';
import { Toaster } from "react-hot-toast";
import Question from './pages/Question/Question';

const noNavRoutes = ['/login','/create-account']

export default function App() {
  const location = useLocation()

  return (
    <>
      <Providers>


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
            <Route path="/question" element={
            <PrivateRoute>
              <Question />
            </PrivateRoute>
            } />
          <Route path="/login" element={<Login />} />
        </Routes>

        <Toaster position='top-right' toastOptions={{style:{fontSize: "2.4rem"}}}></Toaster>
      </Providers>
    </>
  );
}