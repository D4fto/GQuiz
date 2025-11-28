import RandomQuiz from "../../components/RandomQuiz/RandomQuiz";
import styles from "./randomQuiz.module.css";

export default function RandomQuizPage() {
  return (
    <div className={styles.page}>
      <RandomQuiz />
    </div>
  );
}
