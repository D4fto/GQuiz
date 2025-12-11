import styles from './NavBar.module.css';
import gql from '../../assets/gquiz-logo-white.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useGame } from '../../contexts/gameContext';

const noProfileRoutes = ['/question', '/loading', '/result', '/quickTimeEvent', '/waiting-host', '/finished', '/RoomCreationPt2', '/waiting-players', '/profile', '/edit-profile']

export default function NavBar() {
  const { user } = useAuth()
  const location = useLocation()
  const { gameType, toHome } = useGame()
  const navigate = useNavigate()
  console.log(user)


  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={gameType=="room"?toHome:()=>navigate('/')}>
          <img src={gql} alt="GQuiz Logo" className={styles.logoImage} />
      </div>
      <div className={styles.routes}>
        {/* <Link to={'/'}>Home</Link>
        <Link to={'/login'}>Login</Link>
        <Link to={'/worlds'}>Worlds</Link>
        <Link to={'/question'}>Question</Link>
        <Link to={'/profile'}>Profile</Link> */}
      </div>
      {
        !noProfileRoutes.includes(location.pathname) &&
        <div className={styles.user} onClick={()=>navigate('/profile')}>
          Ver Perfil
          <img src={import.meta.env.VITE_URL+"/"+user.imgName+'.png'} alt="Foto de perfil" className={styles.userImage}/>
        </div>
      }
    </nav>
  );
}