import styles from "./CreateAccount.module.css"
import { useNavigate } from "react-router-dom";
import MainButton from "../../components/MainButton/MainButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import { toast } from 'react-hot-toast'
import BlackQ from "../../components/BlackQ/BlackQ";
import { Link } from 'react-router-dom';
export default function CreateAccount(){
    const navigate = useNavigate()
    function handleSubmit(event){
        event.preventDefault()
        fetch(import.meta.env.VITE_API_URL+'/login/create-account', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: event.target.email.value,
                password: event.target.senha.value,
                username: event.target.user.value
            })
        }).then(async (response) => {
            const data = await response.json();
        
            if (!response.ok) {
                if (data.error.code === "P2002") {
                    console.error(data.error.meta.target[0]+" já existe");
                    toast.error(data.error.meta.target[0]+" já existe")
                    return;
                }
        
                console.error("Erro desconhecido:", data.error);
                return;
            }
        
            navigate('/login');
        })
        .catch((error) => {
            console.error("Erro de rede ou fetch:", error);
            // toast.error("Erro de conexão")
        });
    }


    return(
        <div className={styles.container}>
            <div className={styles.ptU}>
                <StyleSquare option={2} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'bottomRight'}></StyleSquare>
                <StyleSquare option={3} innerColor={'var(--primary-dark)'} position={'topLeft'}></StyleSquare>
                <form className={styles.login} onSubmit={handleSubmit}>
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
                        
                        <MainButton text="Fazer Cadastro" type="submit" />
                        
                    </div>  
                </form>
            </div>
                <BlackQ/>
        </div>
    )
}