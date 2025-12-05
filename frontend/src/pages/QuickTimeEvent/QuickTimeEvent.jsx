import { useState, useEffect } from "react"
import styles from "./QuickTimeEvent.module.css"

export default function QuickTimeEvent({ 
    targetWord = "palavra", 
    timeLimit = 10,
    onAnswer = () => {},
    onTimeout = () => {}
}) {
    const [userInput, setUserInput] = useState("")
    const [timeLeft, setTimeLeft] = useState(timeLimit)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    if (onTimeout) onTimeout()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleInputChange = (e) => {
        const value = e.target.value.toLowerCase()
        setUserInput(value)
        
        if (value === targetWord.toLowerCase()) {
            if (onAnswer) onAnswer(true)
        }
    }

    const getTimeColor = () => {
        if (timeLeft <= 3) return styles.timeCritical
        if (timeLeft <= 6) return styles.timeWarning
        return styles.timeNormal
    }

    return (
        <div className={styles.container}>
            <div className={styles.qteCard}>
                <div className={`${styles.timer} ${getTimeColor()}`}>
                    <div className={styles.timerIcon}>⏱️</div>
                    <div className={styles.timerValue}>{timeLeft}s</div>
                </div>

                <h1 className={styles.instruction}>Escreva</h1>
                <h2 className={styles.targetWord}>{targetWord}</h2>

                <div className={styles.inputSection}>
                    <input
                        type="text"
                        className={styles.textInput}
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Digite aqui..."
                        autoFocus
                        maxLength={(targetWord?.length || 10) + 5}
                    />
                    
                    <div className={styles.letterBoxes}>
                        {targetWord && targetWord.split('').map((_, index) => (
                            <div 
                                key={index} 
                                className={`${styles.letterBox} ${
                                    userInput[index] ? styles.letterBoxFilled : ''
                                }`}
                            >
                                {userInput[index] || ''}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}