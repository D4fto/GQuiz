import styles from "./Finished.module.css";
import home from "../../assets/home_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import StyleSquare from "../../components/StyleSquare/StyleSquare";

export default function Finished() {
  return (
    <div className={styles.page}>


      {/* Card do usuário */}
      <div className={styles.userCard}>
        <img className={styles.avatar} src={import.meta.env.VITE_URL+'/geral.png'} alt={"Imagem de"} />
        <div className={styles.username}>D4fto</div>
      </div>

      {/* Pontuação */}
      <div className={styles.scoreBox}>
        <span className={styles.scoreLabel}>Sua Pontuação:</span>
        <span className={styles.scoreValue}>17000/20000</span>
      </div>

      {/* Mensagem final */}
      <h2 className={styles.message}>Parabéns!</h2>

      {/* Botões inferiores */}
      <div className={styles.bottomArea}>
        <button className={styles.borda}> <img className={styles.home} src= {home} alt="" /> </button>
        <button className={styles.retryBtn}>Jogar Novamente</button>
      </div>
      <StyleSquare option={5} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'topRight'}></StyleSquare>
      <StyleSquare option={1} innerColor={'var(--black)'} outColor={'var(--primary)'} position={'bottomLeft'}></StyleSquare>
    </div>
  );
}
