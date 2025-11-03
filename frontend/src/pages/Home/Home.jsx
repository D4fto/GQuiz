import styles from "./Home.module.css";
import TitleBox from "../../components/TitleBox/TitleBox";
import MainButton from "../../components/MainButton/MainButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.home}>
      <StyleSquare option={2} innerColor={'var(--gray)'} outColor={'var(--black)'} position={'bottomRight'}></StyleSquare>
      <div className={styles.rank}>
        <TitleBox title="Ranking Geral" />
      </div>
      <div className={styles.mainContent}>
        <p className={styles.description}>
          Será que você tem capacidade de acertar as perguntas sobre a Gincana
          da UTFPR 2025 ?{" "}
        </p>
        <div className={styles.options}>
          <MainButton text="Entrar em Sala" onClick={() => {}} />
          <MainButton text="Criar Sala" onClick={() => {}} />
          <MainButton
            text="Jogar Fases"
            onClick={() => {
              navigate("/worlds");
            }}
          />
          <MainButton text="Quiz Aleatório" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
