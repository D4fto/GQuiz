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
    
    const getFeedbackContent = () => {
        if (lastIsCorrect === 'timeout') {
            return {
                className: styles.timeout,
                icon: '⏱️',
                text: 'Tempo Esgotado!'
            };
        }
        return {
            className: lastIsCorrect ? styles.correct : styles.incorrect,
            icon: lastIsCorrect ? '✓' : '✗',
            text: lastIsCorrect ? 'Correto!' : 'Incorreto'
        };
    };

    const feedback = getFeedbackContent();
    
    return(
        <div className={styles.container}>
            <div className={styles.resultCard}>
                <div className={`${styles.feedback} ${feedback.className}`}>
                    <span className={styles.feedbackIcon}>
                        {feedback.icon}
                    </span>
                    <h2 className={styles.feedbackText}>
                        {feedback.text}
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

                {gameType !== "room" && (
                    <button 
                    className={styles.nextButton} 
                    onClick={nextQuestion}
                    >
                    Próxima Pergunta
                    </button>
                )}

            </div>
        </div>
    )
}