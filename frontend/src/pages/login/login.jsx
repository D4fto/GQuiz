import styles from "./login.module.css"
import { useNavigate } from "react-router-dom";
import MainButton from "../../components/MainButton/MainButton";
import gql from '../../assets/gquiz-logo-white.svg';
export default function Login(){
    const navigate = useNavigate()


    return(
        <div className={styles.container}>
            <div className={styles.ptU}>
                <div className={styles.login}>
                    <div className={styles.title}>LOGIN</div>
                    <div className={styles.else}>
                        <div className={styles.validation}>
                            <label htmlFor="email">Email</label>
                            <input className={styles.input} type="email" id="email" name="email" placeholder="example@gmail.com"/>
                            <label htmlFor="senha">Digite sua senha</label>
                            <input className={styles.input} type="text" id="senha" name="senha" placeholder="*******"/>
                        </div>
                        
                        <MainButton text="Fazer Login" onClick={() => {navigate("/")}} />
                        
                        <p>Não tem conta? Cadastre-se</p><br />
                        <p>----------------------</p>
                        <div className={styles.google}></div>
                    </div>  
                </div>
            </div>
            <div className={styles.ptD}>
                <div className={styles.logo}>
                    <img src={gql} alt="GQuiz Logo" className={styles.logoImage} />
                </div>
                <h2>Uma plataforma de Quiz sobre a gincana</h2>
            </div>
        </div>
    )
}