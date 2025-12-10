import styles from "./Result.module.css"
import { useGame } from "../../contexts/gameContext"
import { useState, useEffect } from "react";

export default function Result(){
    const {
        nextQuestion, 
        actualScore, 
        lastIsCorrect, 
        actualQuestionIndex,
        numberOfQuestions, 
        partialRanking,
        gameType
    } = useGame()

    const delay = 5
    const [time, setTime] = useState(delay);
    const [questionInitTime, setQuestionInitTime] = useState(null);
    
    useEffect(()=>{
        setQuestionInitTime(Date.now())
    },[])

    useEffect(()=>{
        const endTime = questionInitTime + delay * 1000;

        const timer = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(Math.floor((endTime - now) / 1000), 0);
        setTime(diff+1);

        if (diff <= 0) clearInterval(timer);
        }, 200); 

        return () => clearInterval(timer);
    },[questionInitTime])

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    
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
            <div className={styles.timer}>{formatTime(time)}</div>
            {gameType === "room" && actualQuestionIndex + 1 === numberOfQuestions?
            <div className={styles.ocult}>Resultados ocultos para maior suspense 🤫</div>:
            <>
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
                {gameType === "room" && (
                    <div className={styles.ranking}>
                        <h1>Ranking</h1>
                        <ul>
                            {partialRanking.map((e,i)=>{
                                return <li key={i}>
                                    <div className={styles.imgAndName}>
                                        <img src={import.meta.env.VITE_URL+'/'+e.imgName+'.png'} alt="" />
                                        <span>{e.username}</span>
                                    </div>
                                    <span>{e.score}</span>
                                </li>
                            })}
                        </ul>
                    </div>
                )}
            </>
        }
    </div>
    
    )
}