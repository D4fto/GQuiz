import styles from './NavBar.module.css';
import gql from '../../assets/gquiz-logo-white.svg';
import perfil from '../../assets/perfil.svg';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <img src={gql} alt="GQuiz Logo" className={styles.logoImage} />
            </div>
            <div className={styles.routes}>
              <Link to={'/login'}>Login</Link>
              <Link to={'/worlds'}>Worlds</Link>
            </div>
            <div className={styles.user}>
              Ver Perfil
              <img src={perfil} alt="Foto de perfil" className={styles.userImage}/>

            </div>
        </nav>
    );
}