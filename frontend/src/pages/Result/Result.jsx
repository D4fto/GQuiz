import styles from "./Result.module.css"
import { useGame } from "../../contexts/gameContext"

export default function Result(){
    const {
        nextQuestion, 
        actualScore, 
        lastIsCorrect, 
        actualQuestionIndex,
        numberOfQuestions, 
        gameType
    } = useGame()
    
    return(
        <div className={styles.container}>
            <div className={styles.resultCard}>
                <div className={`${styles.feedback} ${lastIsCorrect ? styles.correct : styles.incorrect}`}>
                    <span className={styles.feedbackIcon}>
                        {lastIsCorrect ? '✓' : '✗'}
                    </span>
                    <h2 className={styles.feedbackText}>
                        {lastIsCorrect ? 'Correto!' : 'Incorreto'}
                    </h2>
                </div>

                <div className={styles.scoreSection}>
                    <div className={styles.scoreLabel}>Pontuação</div>
                    <div className={styles.scoreValue}>{actualScore}</div>
                </div>

                {gameType === "room" && (
                    <div className={styles.progressSection}>
                        <div className={styles.progressLabel}>Progresso</div>
                        <div className={styles.progressValue}>
                            {actualQuestionIndex + 1} / {numberOfQuestions}
                        </div>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill}
                                style={{ width: `${((actualQuestionIndex + 1) / numberOfQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                <button 
                    className={styles.nextButton} 
                    onClick={nextQuestion}
                >
                    Próxima Pergunta
                </button>
            </div>
        </div>
    )
}