import styles from "./UserProfile.module.css";
import StyleSquare from "../StyleSquare/StyleSquare";

export default function UserProfile() {
  return (
    <div className={styles.box}>
      <div className={styles.card}>
        
        <div className={styles.avatarWrapper}>
          <img 
            src="https://via.placeholder.com/140" 
            alt="Foto de Perfil" 
            className={styles.avatar}
          />
        </div>

        <h2 className={styles.name}>Nome do Usuário</h2>
        <p className={styles.username}>@usuario</p>

        <div className={styles.stats}>
          <div>
            <p className={styles.puncctuation}>15</p>
            <span className={styles.span}>Pontos</span>
          </div>
        </div>

        <button className={styles.editButton}>Editar Perfil</button>
      </div>
      <StyleSquare option={2} innerColor={'var(--gray)'} outColor={'var(--black)'} position={'bottomRight'}></StyleSquare>
    </div>
  );
}
