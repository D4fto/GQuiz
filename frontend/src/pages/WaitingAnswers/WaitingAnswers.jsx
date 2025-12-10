import styles from './WaitingAnswers.module.css'
import { useGame } from '../../contexts/gameContext'

export default function WaitingAnswers(){
  const { numberOfAnswers, room } = useGame()

  return <div className={styles.WaitingAnswers}>
    <p className={styles.title}>Esperando os outros responderem</p>
    <p>Faltam:</p>
    <div className={styles.left}>
      {numberOfAnswers}/{room.numberOfPlayers}
    </div>
  </div>
}