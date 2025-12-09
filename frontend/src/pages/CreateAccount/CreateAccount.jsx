import styles from "./CreateAccount.module.css"
import { useNavigate } from "react-router-dom";
import MainButton from "../../components/MainButton/MainButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import { toast } from 'react-hot-toast'
import BlackQ from "../../components/BlackQ/BlackQ";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
export default function CreateAccount(){
    const navigate = useNavigate()
    const [waiting, setWaiting] = useState(false)
    const {user, loading} = useAuth()
    useEffect(()=>{
        if(user){
            console.log(user)
            navigate('/')
        }
    },[loading])
    function handleSubmit(event){
        event.preventDefault()
        setWaiting(true)
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
                    setWaiting(false)
                    return;
                }
        
                console.error("Erro desconhecido:", data.error);
                setWaiting(false)
                return;
            }
        
            navigate('/login');
        })
        .catch((error) => {
            console.error("Erro de rede ou fetch:", error);
            setWaiting(false)
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
                            <input className={styles.input} type="text" id="senha" name="senha" placeholder="••••••••"/>
                        </div>
                        
                        <MainButton text="Fazer Cadastro" type="submit" options={{disabled:waiting}}/>
                        
                    </div>  
                </form>
            </div>
                <BlackQ/>
        </div>
    )
}