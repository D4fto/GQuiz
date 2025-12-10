import styles from "./Podium.module.css";
import home from "../../assets/home_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import { useGame } from "../../contexts/gameContext";
import { useAuth } from "../../contexts/authContext";

export default function Podium() {
  const { user } = useAuth()
  const {
      finishedInfo,
      playRoomAgain,
      toHome,
    } = useGame()
    console.log(finishedInfo)
  return (
    <div className={styles.page}>

      <div className={styles.centerArea}>
        <div className={styles.podiumArea}>
          
          {/* 2º */}
          {
            finishedInfo.top.length>1 &&
            <div className={styles.col2}>
            <span className={styles.name}>{finishedInfo.top[1].username}</span>
            <div className={styles.avatarWrapper}>
              <img src={import.meta.env.VITE_URL + "/"+finishedInfo.top[1].imgName+".png"} className={styles.avatar} />
            </div>
            <div className={styles.podiumBlock2}>
              <span className={styles.number2}>2</span>
              <span className={styles.score}>{finishedInfo.top[1].score}</span>
            </div>
          </div>}

          {/* 1º */}
          {
            finishedInfo.top.length>0 &&
            <div className={styles.col1}>
            <span className={styles.name}>{finishedInfo.top[0].username}</span>
            <div className={styles.avatarWrapper}>
              <img src={import.meta.env.VITE_URL + "/"+ finishedInfo.top[0].imgName +".png"} className={styles.avatar} />
            </div>
            <div className={styles.podiumBlock1}>
              <span className={styles.number1}>1</span>
              <span className={styles.score}>{finishedInfo.top[0].score}</span>
            </div>
          </div>}

          {/* 3º */}
          {
            finishedInfo.top.length>2 &&
            <div className={styles.col3}>
              <span className={styles.name}>{finishedInfo.top[2].username}</span>
              <div className={styles.avatarWrapper}>
                <img src={import.meta.env.VITE_URL + "/"+ finishedInfo.top[2].imgName +".png"} className={styles.avatar} />
              </div>
              <div className={styles.podiumBlock3}>
                <span className={styles.number3}>3</span>
                <span className={styles.score}>{finishedInfo.top[2].score}</span>
              </div>
            </div>

          }

        </div>

        {/* Lista inferior */}
        {finishedInfo.top.map((e,i) => {
          if(e.id!==user.id){
            return<></>
          }
          return <div className={styles.listItem}>
            <span className={styles.position}>{i+1}</span>

            <div className={styles.avatarWrapper}>
              <img src={import.meta.env.VITE_URL + "/"+e.imgName+".png"} className={styles.listAvatar}/>
            </div>

            <span className={styles.listName}>{e.username}</span>
            <span className={styles.listScore}>{e.score}</span>
          </div>
        })}
      </div>

      {/* Botões */}
      <div className={styles.options}>

        <button className={styles.borda}>
          <img className={styles.home} src={home} alt="home" onClick={toHome}/>
        </button>

        <button className={styles.retryBtn} onClick={playRoomAgain}>
          Jogar Novamente
        </button>

      </div>
    </div>
  );
}
