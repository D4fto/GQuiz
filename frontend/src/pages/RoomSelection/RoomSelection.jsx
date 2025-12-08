import { useState, useEffect } from 'react';
import styles from './RoomSelection.module.css';
import StyleSquare from '../../components/StyleSquare/StyleSquare';
import BackButton from '../../components/BackButton/BackButton';
import TitleBox from '../../components/TitleBox/TitleBox'
import { useGame } from '../../contexts/gameContext';

export default function RoomSelect() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState([])
  const [roomSelected, setRoomSelected] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { joinRoom } = useGame()
  
  async function updateRooms() {
    try{
      const response = await (await fetch(import.meta.env.VITE_API_URL+'/game/rooms',{
        credentials: "include"
      })).json()
      response.rooms = response.rooms.filter((room)=>{
        return room.acceptingPlayers
      })
      setRooms(response.rooms)
    }catch(e){
      console.error(e)
    }
  }

  useEffect(()=>{
    updateRooms()
  },[])

  function handleStart(){
    const selectedRoom = rooms.find(room => room.id === roomSelected)
    
    if (!selectedRoom) {
      alert('Por favor, selecione uma sala')
      return
    }
    
    if (selectedRoom.hasPassword) {
      setShowPasswordModal(true)
      setPassword('')
      setPasswordError('')
    } else {
      joinRoom(roomSelected)
    }
  }
  
  async function handleJoinWithPassword() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/game/rooms/${roomSelected}/verify-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      })
      
      const data = await response.json()
      
      if (data.success || response.ok) {
        setShowPasswordModal(false)
        joinRoom(roomSelected, password)
      } else {
        setPasswordError('Senha incorreta. Tente novamente.')
      }
    } catch (e) {
      setPasswordError('Erro ao verificar senha. Tente novamente.')
      console.error(e)
    }
  }
  
  const filteredRooms = rooms.filter(room =>
    room.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          <button className={styles.addButton} onClick={updateRooms}>+</button>
        </div>

        {/* Rooms List */}
        <div className={styles.roomsList}>
          {filteredRooms.map((room) => (
            <div key={room.id} className={`${styles.roomItem} ${roomSelected==room.id?styles.selected:''}`} onClick={()=>setRoomSelected(room.id)}>
              <div className={styles.roomInfo}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className={styles.roomName}>{room.id}</span>
              </div>
              
              <div className={styles.roomDetails}>
                <span className={styles.roomScore}>{room.numberOfPlayers}/{room.maxNumberOfPlayers}</span>
                {room.hasPassword && (
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
          <button className={styles.playButton} onClick={handleStart}>Jogar</button>
        </div>
      </div>
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Sala Protegida</h2>
            <p className={styles.modalSubtitle}>Digite a senha para entrar</p>
            
            <div className={styles.passwordInputContainer}>
              <input
                type="password"
                placeholder="Senha..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError('')
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinWithPassword()}
                className={styles.passwordInput}
                autoFocus
              />
            </div>
            
            {passwordError && (
              <p className={styles.errorMessage}>{passwordError}</p>
            )}
            
            <div className={styles.modalButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowPasswordModal(false)}
              >
                Cancelar
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleJoinWithPassword}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BackButton/>
    </div>
  );
}