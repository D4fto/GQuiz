import styles from "./CreateAccount.module.css"
import { useNavigate } from "react-router-dom";
import MainButton from "../../components/MainButton/MainButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import BlackQ from "../../components/BlackQ/BlackQ";
import { Link } from 'react-router-dom';
export default function CreateAccount(){
    const navigate = useNavigate()


    return(
        <div className={styles.container}>
            <div className={styles.ptU}>
                <StyleSquare option={2} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'bottomRight'}></StyleSquare>
                <StyleSquare option={3} innerColor={'var(--primary-dark)'} position={'topLeft'}></StyleSquare>
                <div className={styles.login}>
                    <div className={styles.title}>CADASTRAR-SE</div>
                    <div className={styles.else}>
                        <div className={styles.validation}>
                            <label htmlFor="user">Nome de usuário:</label>
                            <input className={styles.input} type="text" name="user" id="user" placeholder="NomeLegal123" />
                            <label htmlFor="email">Email</label>
                            <input className={styles.input} type="email" id="email" name="email" placeholder="example@gmail.com"/>
                            <label htmlFor="senha">Digite sua senha</label>
                            <input className={styles.input} type="text" id="senha" name="senha" placeholder="*******"/>
                        </div>
                        
                        <MainButton text="Fazer Cadastro" onClick={() => {navigate("/")}} />
                        
                    </div>  
                </div>
            </div>
                <BlackQ/>
        </div>
    )
}