import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./RoomCreation.module.css";
import { toast } from 'react-hot-toast'
import { useGame } from "../../contexts/gameContext";

import group from "../../assets/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

export default function RoomCreation() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("")
  const [password, setPassword] = useState("")
  const [maxPlayers, setMaxPlayers] = useState(2)
  const { createRoom} = useGame()

  function handleRoomName(e){
    const value = e.target.value
    setRoomName(value)
  }

  function handlePassword(e){
    setPassword(e.target.value)
  }
  
  function handleMaxPlayers(e){
    const value = e.target.value.replace(/\D/g, "")
    if(!value){
      setMaxPlayers("")
      return
    }
    if(Number(value)>40){
      setMaxPlayers(40)
      return
    }
    setMaxPlayers(Number(value))
  }

  function handleSubmit(e){
    e.preventDefault()
    if(!roomName){
      toast.error("Nome da sala vazio")
      return
    }
    if(!maxPlayers || Number(maxPlayers)<2){
      toast.error("Número de players inválido")
      return
    }
    if(password){
      createRoom(roomName, maxPlayers, password)
      return
    }
    createRoom(roomName, maxPlayers)
    return
  }

  return (
    <div className={styles.page}>
      <div className={styles.topTab}>Criação de Sala</div>

      <div className={styles.card}>
        <div className={styles.leftArea}>
          <img src={group} className={styles.group} alt="dice" />
        </div>

        <form className={styles.rightArea} onSubmit={handleSubmit}>
          <h2>Configurações</h2>

          <div className={styles.field}>
            <label>Nome da sala:</label>
            <input type="text" placeholder="Sala0" value={roomName} onChange={handleRoomName} required/>
          </div>

          <div className={styles.field}>
            <label>Senha da sala</label>
            <input type="text" placeholder="Vazio para ser pública" value={password} onChange={handlePassword} />
          </div>

          <div className={styles.field}>
            <label>Nº de Participantes:</label>
            <input type="number" placeholder="0" value={maxPlayers} onChange={handleMaxPlayers} required/>
          </div>

          <p className={styles.divirta}>Divirta-se !</p>
          <div className={styles.stake}></div>

          <button 
            className={styles.playBtn}
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}