import RandomQuiz from "../../components/RandomQuiz/RandomQuiz";
import BackButton from "../../components/BackButton/BackButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import styles from "./randomQuiz.module.css";

export default function RandomQuizPage() {
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <RandomQuiz />



        <BackButton classes={styles.boto} />
      </div>
      <div><StyleSquare option={2} innerColor={'var(--primary-dark)'} outColor={'var(--primary)'} position={'bottomRight'}></StyleSquare></div>
    </div>
  );
}
