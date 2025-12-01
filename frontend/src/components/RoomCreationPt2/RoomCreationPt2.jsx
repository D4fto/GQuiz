import styles from "./RoomCreationPt2.module.css";
import BackButton from "../../components/BackButton/BackButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import group from "../../assets/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

export default function RoomCreationPt2() {
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <div className={styles.topTab}>Criação de Sala</div>

        <div className={styles.card}>
          <div className={styles.leftArea}>
            <img src={group} className={styles.group} alt="group" />
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

            <button className={styles.playBtn}>Criar</button>
          </div>

          <BackButton classes={styles.boto} />
        </div>
      </div>

      <div>
        <StyleSquare
          option={2}
          innerColor={"var(--primary-dark)"}
          outColor={"var(--primary)"}
          position={"bottomRight"}
        />
      </div>
    </div>
  );
}
