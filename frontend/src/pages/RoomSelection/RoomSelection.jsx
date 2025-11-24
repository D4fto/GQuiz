import React, { useState } from "react"
import styles from "./RoomSelection.module.css"
import {Search, Plus, Users, Lock} from 'lucide-react'


function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [rooms] = useState([
    { id: 1, name: "Sala1", score: "10/10", isLocked: true },
    { id: 2, name: "Sala2", score: "10/20", isLocked: false },
    { id: 3, name: "Sala3", score: "10/10", isLocked: false },
    { id: 4, name: "Sala4", score: "5/10", isLocked: true },
    { id: 5, name: "Sala5", score: "9/10", isLocked: true },
    { id: 6, name: "Sala6", score: "15/20", isLocked: false },
    { id: 7, name: "Sala7", score: "7/10", isLocked: false },
    { id: 8, name: "Sala8", score: "2/10", isLocked: false },
  ])

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Qual Sala Deseja ?</h1>
          <button className={styles.backButton}>
            <span className={styles.backArrow}>←</span>
          </button>
        </div>

        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar sala..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.addButton}>
            <Plus size={20} />
          </button>
        </div>

        <div className={styles.roomList}>
          {filteredRooms.map((room) => (
            <div key={room.id} className={styles.roomItem}>
              <div className={styles.roomLeft}>
                <Users size={18} className={styles.usersIcon} />
                <span className={styles.roomName}>{room.name}</span>
              </div>
              <div className={styles.roomRight}>
                <span className={styles.roomScore}>{room.score}</span>
                {room.isLocked && <Lock size={18} className={styles.lockIcon} />}
              </div>
            </div>
          ))}
        </div>

        <button className={styles.playButton}>Jogar</button>
      </div>
    </div>
  )
}

export default App
