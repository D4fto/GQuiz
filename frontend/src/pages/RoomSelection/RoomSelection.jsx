import React, { useState } from 'react';
import styles from './RoomSelection.module.css';
import StyleSquare from '../../components/StyleSquare/StyleSquare';
import BackButton from '../../components/BackButton/BackButton';
import TitleBox from '../../components/TitleBox/TitleBox'

export default function RoomSelect() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const rooms = [
    { id: 1, name: 'Sala1', people: '10/10', locked: true },
    { id: 2, name: 'Sala2', people: '10/20', locked: false },
    { id: 3, name: 'Sala3', people: '10/10', locked: false },
    { id: 4, name: 'Sala4', people: '5/10', locked: true },
    { id: 5, name: 'Sala5', people: '9/10', locked: true },
    { id: 6, name: 'Sala6', people: '15/20', locked: false },
    { id: 7, name: 'Sala7', people: '7/10', locked: false },
    { id: 8, name: 'Sala8', people: '2/10', locked: false },
    { id: 10, name: 'Sala10', people: '2/10', locked: false },
  ];

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <StyleSquare option={1} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'bottomLeft'}></StyleSquare>
      <div className={styles.mainContent}>
        {/* Title */}
        <TitleBox title={"Qual sala deseja?"}/>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <div className={styles.searchInput}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar sala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.input}
            />
          </div>
          <button className={styles.addButton}>+</button>
        </div>

        {/* Rooms List */}
        <div className={styles.roomsList}>
          {filteredRooms.map((room) => (
            <div key={room.id} className={styles.roomItem}>
              <div className={styles.roomInfo}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className={styles.roomName}>{room.name}</span>
              </div>
              
              <div className={styles.roomDetails}>
                <span className={styles.roomScore}>{room.score}</span>
                {room.locked && (
                  <svg className={styles.lockIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Play Button */}
        <div className={styles.playButtonContainer}>
          <button className={styles.playButton}>Jogar</button>
        </div>
      </div>
        <BackButton/>
    </div>
  );
}