import styles from "./RandomQuiz.module.css";
import dice from "../../assets/dice.svg"

export default function RandomQuiz() {
  return (
    <div className={styles.page}>
      <div className={styles.topTab}>Quiz Aleatório</div>

      <div className={styles.card}>
        <div className={styles.leftArea}>
          <img src={dice} className={styles.dice} />
        </div>

        <div className={styles.rightArea}>
          <h2>Configurações</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nº de perguntas</label>
              <input type="number" placeholder="0" />
            </div>

            <div className={styles.field}>
              <label>Tempo por pergunta</label>
              <input type="text" placeholder="0:00" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Categoria</label>
            <input type="text" placeholder="Todos" />
          </div>


            <div className={styles.checkboxRow}>
              <input type="checkbox" id="qte" className={styles.checkbox} />
              <label htmlFor="qte">Quick Time Events</label>
            </div>


          <p className={styles.divirta}>Divirta-se !</p>
          <div className={styles.stake}></div>

          <button className={styles.playBtn}>Jogar</button>
        </div>
      </div>
    </div>
  );
}

