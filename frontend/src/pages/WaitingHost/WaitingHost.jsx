import styles from './WaitingHost.module.css'

export default function WaitingHost(){
  return <div className={styles.container}>
    <p>Esperando o Host reiniciar a partida</p>
    <div className={styles.spinner}></div>
  </div>
}