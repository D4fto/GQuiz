import styles from "./Podium.module.css";
import home from "../../assets/home_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

export default function Podium() {
  return (
    <div className={styles.page}>

      <div className={styles.centerArea}>
        <div className={styles.podiumArea}>
          
          {/* 2º */}
          <div className={styles.col2}>
            <span className={styles.name}>D4fto</span>
            <div className={styles.avatarWrapper}>
              <img src={import.meta.env.VITE_URL + "/geral.png"} className={styles.avatar} />
            </div>
            <div className={styles.podiumBlock2}>
              <span className={styles.number2}>2</span>
              <span className={styles.score}>14965</span>
            </div>
          </div>

          {/* 1º */}
          <div className={styles.col1}>
            <span className={styles.name}>Al Capone</span>
            <div className={styles.avatarWrapper}>
              <img src={import.meta.env.VITE_URL + "/geral.png"} className={styles.avatar} />
            </div>
            <div className={styles.podiumBlock1}>
              <span className={styles.number1}>1</span>
              <span className={styles.score}>15004</span>
            </div>
          </div>

          {/* 3º */}
          <div className={styles.col3}>
            <span className={styles.name}>Opala</span>
            <div className={styles.avatarWrapper}>
              <img src={import.meta.env.VITE_URL + "/geral.png"} className={styles.avatar} />
            </div>
            <div className={styles.podiumBlock3}>
              <span className={styles.number3}>3</span>
              <span className={styles.score}>13089</span>
            </div>
          </div>

        </div>

        {/* Lista inferior */}
        <div className={styles.listItem}>
          <span className={styles.position}>5</span>

          <div className={styles.avatarWrapper}>
            <img src={import.meta.env.VITE_URL + "/geral.png"} className={styles.listAvatar}/>
          </div>

          <span className={styles.listName}>Shiba</span>
          <span className={styles.listScore}>11590</span>
        </div>
      </div>

      {/* Botões */}
      <div className={styles.options}>

        <button className={styles.borda}>
          <img className={styles.home} src={home} alt="home" />
        </button>

        <button className={styles.retryBtn}>
          Jogar Novamente
        </button>

      </div>
    </div>
  );
}
