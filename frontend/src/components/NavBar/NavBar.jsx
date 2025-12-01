import styles from './NavBar.module.css';
import gql from '../../assets/gquiz-logo-white.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const noProfileRoutes = ['/question']

export default function NavBar() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  console.log(user)


  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
          <img src={gql} alt="GQuiz Logo" className={styles.logoImage} />
      </div>
      <div className={styles.routes}>
        <Link to={'/'}>Home</Link>
        <Link to={'/login'}>Login</Link>
        <Link to={'/worlds'}>Worlds</Link>
        <Link to={'/question'}>Question</Link>
        <Link to={'/profile'}>Profile</Link>
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