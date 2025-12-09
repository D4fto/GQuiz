import styles from "./Finished.module.css";
import home from "../../assets/home_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import { useGame } from "../../contexts/gameContext";
import { useAuth } from "../../contexts/authContext";
import Podium from "../Podium/Podium";

export default function Finished() {
  const {
    finishedInfo,
    startLevel,
    gameType, 
    playRoomAgain,
    toHome,
    startRandom
  } = useGame()

  const { user } = useAuth()

  const playAgainFunctions = {
    level: ()=>startLevel(finishedInfo.id),
    random: ()=>startRandom(finishedInfo.numberOfQuestions, finishedInfo.timeByQuestion, finishedInfo.categories, finishedInfo.hasQuickTime),
    room: ()=>{playRoomAgain()}
  }
  
  return (
    gameType == "room" || true
    ? <Podium></Podium>
    :<div className={styles.page}>

      {/* Identificação do level */}
      {
        gameType == "level" &&
        <div className={styles.levelInfo}>
          <div dangerouslySetInnerHTML={{__html:finishedInfo.world.icon}}></div>
          <div>{finishedInfo.number}</div>
        </div>
      }


      {/* Card do usuário */}
      <div className={styles.userCard}>
        <img className={styles.avatar} src={import.meta.env.VITE_URL+"/"+user.imgName+'.png'} alt={"Imagem de " + user.username} />
        <div className={styles.username}>{user.username}</div>
      </div>

      {/* Pontuação */}
      <div className={styles.scoreBox}>
        <span className={styles.scoreLabel}>Sua Pontuação:</span>
        <span className={styles.scoreValue}>{finishedInfo.score}/{finishedInfo.totalWeight}</span>
      </div>

      {/* Mensagem final */}
      <h2 className={styles.message}>Parabéns!</h2>

      {/* Botões inferiores */}
      <div className={styles.bottomArea}>
        <button className={styles.borda} onClick={toHome}> <img className={styles.home} src= {home} alt="" /> </button>
        <div className={styles.options}>
          <button className={styles.retryBtn} onClick={playAgainFunctions[gameType]}>Jogar Novamente</button>
          {finishedInfo.next && <button className={styles.retryBtn} onClick={()=>startLevel(finishedInfo.next)} >Próxima</button>}
        </div>
      </div>
      <StyleSquare option={5} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'topRight'}></StyleSquare>
      <StyleSquare option={1} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'bottomLeft'}></StyleSquare>
    </div>
  );
}
