import styles from "./login.module.css"
import { useNavigate } from "react-router-dom";
import MainButton from "../../components/MainButton/MainButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import BlackQ from "../../components/BlackQ/BlackQ";
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import { useEffect } from "react";
import { useAuth } from "../../contexts/authContext";

export default function Login(){
    const {user, loading} = useAuth()
    const navigate = useNavigate()
    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[loading])
    function handleSubmit(event){
        event.preventDefault()
        fetch(import.meta.env.VITE_API_URL+'/login', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: event.target.email.value,
                password: event.target.senha.value
            })
        }).then(async (response)=>{
            const data = await response.json();
            if(data.error){
                console.error(data.error)
                toast.error(data.error)
                return
            }
            window.location.href = import.meta.env.VITE_URL;
        }).catch((error)=>{
            console.error(error)
            toast.error(error)
        })
    }
    function logout(event){
        event.preventDefault()
        fetch(import.meta.env.VITE_API_URL+'/login/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(async (response) => {
            const data = await response.json();
            console.log(data);
        })
    }


    return(
        <div className={styles.container}>
            <div className={styles.ptU}>
                <StyleSquare option={2} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'bottomRight'}></StyleSquare>
                <StyleSquare option={3} innerColor={'var(--primary-dark)'} position={'topLeft'}></StyleSquare>
                <form className={styles.login} onSubmit={handleSubmit}>
                    <div className={styles.title}>LOGIN</div>
                    <div className={styles.else}>
                        <div className={styles.validation}>
                            <label htmlFor="email">Email</label>
                            <input className={styles.input} type="email" id="email" name="email" placeholder="example@gmail.com"/>
                            <label htmlFor="senha">Digite sua senha</label>
                            <input className={styles.input} type="text" id="senha" name="senha" placeholder="*******"/>
                        </div>
                        
                        <MainButton text="Fazer Login" onClick={() => {}} />
                        
                        <div className={styles.account}>Não tem conta? <Link className={styles.link} to={'/create-account'}>Cadastre-se</Link></div>
                        <div className={styles.white}></div>
                        <div className={styles.google} onClick={logout}>
                            <img className={styles.img} src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" alt="" />
                            continuar com google
                        </div>
                    </div>  
                </form>
            </div>
                <BlackQ/>
        </div>
    )
}