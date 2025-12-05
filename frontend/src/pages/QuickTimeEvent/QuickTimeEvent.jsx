import { useState, useEffect, useRef } from "react"
import styles from "./QuickTimeEvent.module.css"

export default function QuickTimeEvent() {
    const words = [
        "BANANA", "LARANJA", "ABACAXI", "MELANCIA", "MORANGO",
        "CACHORRO", "GATO", "ELEFANTE", "GIRAFA", "LEAO",
        "COMPUTADOR", "TECLADO", "MOUSE", "MONITOR", "CELULAR",
        "FUTEBOL", "BASQUETE", "VOLEI", "NATACAO", "CORRIDA",
        "PIZZA", "HAMBURGUER", "SORVETE", "CHOCOLATE", "BRIGADEIRO",
        "BRASIL", "PORTUGAL", "ARGENTINA", "FRANCA", "ITALIA",
        "ESCOLA", "PROFESSOR", "ESTUDANTE", "LIVRO", "CADERNO",
        "FAMILIA", "AMIZADE", "FELICIDADE", "AMOR", "PAZ"
    ]
    
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10)
    const [userInput, setUserInput] = useState("")
    const [targetWord, setTargetWord] = useState("")
    const [revealedLetters, setRevealedLetters] = useState(2)
    const [isGameActive, setIsGameActive] = useState(true)
    const [feedback, setFeedback] = useState("")
    const inputRef = useRef(null)
    
    // Initialize with a random word
    useEffect(() => {
        selectNewWord()
    }, [])

    const selectNewWord = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)]
        setTargetWord(randomWord)
        setRevealedLetters(Math.min(2, randomWord.length))
    }

    useEffect(() => {
        if (!isGameActive) return
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setIsGameActive(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isGameActive, targetWord])

    // Global key listener - always capture input
    useEffect(() => {
        const handleGlobalKeyPress = (e) => {
            if (!isGameActive) return
            
            // Focus input on any alphanumeric key
            if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                if (inputRef.current) {
                    inputRef.current.focus()
                }
            }
        }

        window.addEventListener('keydown', handleGlobalKeyPress)
        return () => window.removeEventListener('keydown', handleGlobalKeyPress)
    }, [isGameActive])

    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase()
        setUserInput(value)
        
        // Auto-submit when all letters are typed
        if (value.length === targetWord.length) {
            setTimeout(() => checkAnswer(value), 100)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && userInput.length > 0) {
            checkAnswer(userInput)
        }
    }

    const checkAnswer = (answer) => {
        if (answer === targetWord) {
            const points = Math.ceil((timeLeft / 10) * 100)
            setScore(prev => prev + points)
            setFeedback(`+${points} pontos! ✓`)
            setTimeout(() => {
                setUserInput("")
                selectNewWord()
                setTimeLeft(10)
                setFeedback("")
                if (inputRef.current) {
                    inputRef.current.focus()
                }
            }, 800)
        } else {
            setFeedback("Incorreto! Tente novamente")
            setTimeout(() => {
                setFeedback("")
                setUserInput("")
                if (inputRef.current) {
                    inputRef.current.focus()
                }
            }, 1000)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className={styles.container}>
            {/* Score and Timer Bar */}
            <div className={styles.scoreBar}>
                <div className={styles.score}>{score}</div>
                <div className={styles.timer}>{formatTime(timeLeft)}</div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.instruction}>
                    Digite o mais rápido possível:
                </div>

                <div className={styles.targetWord}>
                    {targetWord}
                </div>

                {/* Letter Boxes */}
                <div className={styles.letterBoxes}>
                    {targetWord.split('').map((letter, index) => {
                        const isRevealed = index < revealedLetters
                        const userLetter = userInput[index] || ''
                        const isCorrect = userLetter === letter
                        const hasInput = userLetter !== ''
                        
                        return (
                            <div
                                key={index}
                                className={`${styles.letterBox} ${hasInput ? styles.letterBoxFilled : ''} ${hasInput && !isCorrect ? styles.letterBoxIncorrect : ''}`}
                            >
                                {isRevealed ? letter : (hasInput ? userLetter : '')}
                            </div>
                        )
                    })}
                </div>

                {/* Hidden Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    maxLength={targetWord.length}
                    disabled={!isGameActive}
                    className={styles.hiddenInput}
                    autoComplete="off"
                    autoFocus
                />

                {/* Feedback Message */}
                {feedback && (
                    <div className={styles.feedback}>
                        {feedback}
                    </div>
                )}

                {/* Game Status */}
                {!isGameActive && (
                    <div className={styles.gameOver}>
                        Tempo esgotado! Pontuação final: {score}
                    </div>
                )}
            </div>
        </div>
    )
}