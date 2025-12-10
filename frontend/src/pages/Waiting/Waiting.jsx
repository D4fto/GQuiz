import React from 'react';
import styles from './Waiting.module.css';
import TitleBox from '../../components/TitleBox/TitleBox';
import { useGame } from '../../contexts/gameContext';
import { useAuth } from '../../contexts/authContext';
import StyleSquare from '../../components/StyleSquare/StyleSquare';


export default function Waiting(){
  const {room,players,initRoomGame}  = useGame()
  const {user} = useAuth()

  return (
    <div className={styles.container}>
            <StyleSquare option={4} innerColor={'var(--black)'} outColor={'var(--gray)'} position={'bottomLeft'}></StyleSquare>
        <div className={styles.waitingCard}>
          <div className = {styles.title}>
            <TitleBox title={<div><p>Esperando Jogadores</p><p>Nome da sala: {room.id}</p></div>} />
          </div>
          
          <div className={styles.playersList}>
            <ul>
              {Array.from(players.values()).map((player,i) => (
                <li key={i} className={styles.playerItem}>
                    <img src={import.meta.env.VITE_URL+"/"+player.imgName+".png"} />
                    <span>{player.username}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.playerCount}>
            {players.size}/{room.maxNumberOfPlayers}
          </div>

        </div>
          {user?.id === room?.host && (
            <button className={styles.startBtn} onClick={initRoomGame}>
              Iniciar
            </button>
          )}
    </div>
  );
};
