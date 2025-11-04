import gql from '../../assets/gquiz-logo-white.svg';
import styles from "./BlackQ.module.css"
export default function BlackQ(){
    return(
        <div className={styles.ptD}>
            <div className={styles.logo}>
                <img src={gql} alt="GQuiz Logo" className={styles.logoImage} />
            </div>
            <div className={styles.us}>Uma plataforma de Quiz sobre a gincana</div>
        </div>
    )
}