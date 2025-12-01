import { useNavigate } from "react-router-dom";
import styles from "./RoomCreation.module.css";
import group from "../../assets/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";

export default function RoomCreation() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.topTab}>Criação de Sala</div>

      <div className={styles.card}>
        <div className={styles.leftArea}>
          <img src={group} className={styles.group} alt="dice" />
        </div>

        <div className={styles.rightArea}>
          <h2>Configurações</h2>

          <div className={styles.field}>
            <label>Nome da sala:</label>
            <input type="text" placeholder="Sala0" />
          </div>

          <div className={styles.field}>
            <label>Senha da sala</label>
            <input type="text" placeholder="Vazio para ser pública" />
          </div>

          <div className={styles.field}>
            <label>Nº de Participantes:</label>
            <input type="number" placeholder="0" />
          </div>

          <p className={styles.divirta}>Divirta-se !</p>
          <div className={styles.stake}></div>

          <button 
            className={styles.playBtn}
            onClick={() => navigate("/roomCreationPt2")}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}