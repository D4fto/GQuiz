import styles from './NavBar.module.css';
import gql from '../../assets/gquiz-logo-white.svg';
import perfil from '../../assets/perfil.svg';
import { Link, useLocation } from 'react-router-dom';

const noProfileRoutes = ['/question']

export default function NavBar() {
  const location = useLocation()


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
          </div>
          {
            !noProfileRoutes.includes(location.pathname) &&
            <div className={styles.user}>
              Ver Perfil
              <img src={perfil} alt="Foto de perfil" className={styles.userImage}/>
            </div>
          }
      </nav>
  );
}