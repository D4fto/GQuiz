import React from 'react';
import styles from './Waiting.module.css';
import TitleBox from '../../components/TitleBox/TitleBox';

// Mock data para preview
const mockUser = { id: 117 };
const mockRoom = { id: "rgegr AcpKtX", maxNumberOfPlayers: 20, numberOfPlayers: 6, host: 117 };
const mockPlayers = new Map([
  [1, { id: 1, username: "Al Capone", imgName: "geral" }],
  [2, { id: 2, username: "D4fto", imgName: "leandro" }],
  [3, { id: 3, username: "Opala", imgName: "legal" }],
  [4, { id: 4, username: "O bruxo", imgName: "mohamed" }],
  [5, { id: 5, username: "Shiba", imgName: "legal" }],
  [117, { id: 117, username: "Tomas", imgName: "mohamed" }]
]);

export default function Waiting(){
  const user = mockUser;
  const room = mockRoom;
  const players = mockPlayers;
  
  const initRoomGame = () => {
    console.log('Iniciar jogo');
  };

  return (
    <div className={styles.container}>
        <div className={styles.waitingCard}>
          <div className = {styles.title}>
            <TitleBox title="Esperando Jogadores" />
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
