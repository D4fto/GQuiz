import styles from "./CreateAccount.module.css";
import { useNavigate } from "react-router-dom";
import MainButton from "../../components/MainButton/MainButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import { toast } from 'react-hot-toast';
import BlackQ from "../../components/BlackQ/BlackQ";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import BackButton from "../../components/BackButton/BackButton";

export default function CreateAccount() {
    const [senha, setSenha] = useState('');
    const [confirma, setConfirma] = useState('');
    const [mostrarConfirma, setMostrarConfirma] = useState(false); // Estado para o olho
    const navigate = useNavigate();
    const [waiting, setWaiting] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (user) {
            console.log(user);
            navigate('/');
        }
    }, [loading]);

    function handleSubmit(event) {
        event.preventDefault(); // Mudei para o topo

        if (senha !== confirma) {
            toast.error('Credenciais não batem');
            return;
        }

        setWaiting(true);
        fetch(import.meta.env.VITE_API_URL + '/login/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: event.target.email.value,
                password: senha, // Usando o estado
                username: event.target.user.value
            })
        }).then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                if (data.error.code === "P2002") {
                    console.error(data.error.meta.target[0] + " já existe");
                    toast.error(data.error.meta.target[0] + " já existe");
                    setWaiting(false);
                    return;
                }

                console.error("Erro desconhecido:", data.error);
                setWaiting(false);
                return;
            }

            navigate('/login');
        })
        .catch((error) => {
            console.error("Erro de rede ou fetch:", error);
            setWaiting(false);
        });
    }

    return (
        <div className={styles.container}>
            <BackButton/>
            <div className={styles.ptU}>
                <StyleSquare option={2} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'bottomRight'}></StyleSquare>
                <StyleSquare option={3} innerColor={'var(--primary-dark)'} position={'topLeft'}></StyleSquare>
                
                <form className={styles.login} onSubmit={handleSubmit}>
                    <div className={styles.title}>CADASTRAR-SE</div>
                    <div className={styles.else}>
                        <div className={styles.validation}>
                            <label htmlFor="user">Nome de usuário:</label>
                            <input className={styles.input} type="text" maxLength={15} name="user" id="user" placeholder="NomeLegal123" required />
                            
                            <label htmlFor="email">Email</label>
                            <input className={styles.input} type="email" maxLength={75} id="email" name="email" placeholder="example@gmail.com" required/>
                            
                            <label htmlFor="senha">Digite sua senha</label>
                            <input 
                                className={styles.input} 
                                type="text" // Alterado para password
                                id="senha"  
                                maxLength={25} 
                                name="senha" 
                                placeholder="••••••••" 
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            
                            <label htmlFor="confirma">Confirme sua senha</label>
                            <div className={styles.passwordWrapper}>
                                <input 
                                    className={styles.input} 
                                    type={mostrarConfirma ? "text" : "password"} // Dinâmico
                                    id="confirma" 
                                    maxLength={25} 
                                    name="confirma" 
                                    placeholder="••••••••" 
                                    value={confirma}
                                    onChange={(e) => setConfirma(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className={styles.eyeIcon}
                                    onClick={() => setMostrarConfirma(!mostrarConfirma)}
                                    tabIndex="-1" // Evita foco ao dar tab
                                >
                                    {mostrarConfirma ? (
                                        // Ícone Olho Aberto
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 11 19.5C11.33 19.5 11.67 19.48 12 19.45C12.33 19.48 12.67 19.5 13 19.5C18 19.5 22.27 16.39 24 12C22.27 7.61 18 4.5 13 4.5C12.67 4.5 12.33 4.52 12 4.55C11.67 4.52 11.33 4.5 11 4.5H12ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                                        </svg>
                                    ) : (
                                        // Ícone Olho Fechado
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 2L22 22M10.5 10.5L13.5 13.5M9.5 12C9.5 13.38 10.62 14.5 12 14.5C12.45 14.5 12.86 14.36 13.21 14.12L15.35 16.26C14.36 16.73 13.22 17 12 17C9.24 17 7 14.76 7 12C7 10.78 7.27 9.64 7.74 8.65L9.88 10.79C9.64 11.14 9.5 11.55 9.5 12ZM22.54 16.89C23.46 15.42 24 13.78 24 12C22.27 7.61 18 4.5 13 4.5C11.38 4.5 9.85 4.9 8.46 5.61L11.39 8.54C11.91 8.51 12.44 8.5 13 8.5C18 8.5 22.27 11.61 24 16L22.54 16.89ZM1 12C2.73 7.61 7 4.5 11 4.5C11.53 4.5 12.04 4.53 12.54 4.59L17.59 9.64C16.59 7.74 14.88 6.5 13 6.5C10.34 6.5 8.08 8.16 7.23 10.5L3.38 6.65L1.41 8.62L17.41 24.62L19.38 22.65L15.7 18.97C14.86 19.31 13.95 19.5 13 19.5C8 19.5 3.73 16.39 2 12H1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </button>
                            </div>

                        </div>
                        
                        <MainButton text="Fazer Cadastro" type="submit" options={{disabled:waiting}}/>
                        
                    </div>  
                </form>
            </div>
            <BlackQ/>
        </div>
    )
}