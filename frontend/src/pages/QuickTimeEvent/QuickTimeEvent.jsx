import { useState, useEffect, useRef } from "react"
import styles from "./QuickTimeEvent.module.css"
import { useGame } from "../../contexts/gameContext"

export default function QuickTimeEvent() {

    const { quickTimeEvent, 
        answerQuick, 
        questionInitTime, 
        timeByQuestion,
        gameType,
        room,
        numberOfAnswers
        
    } = useGame()

    

    const [time, setTime] = useState(timeByQuestion);
    const [userInput, setUserInput] = useState("")
    const [targetWord, setTargetWord] = useState("")
    const [revealedLetters, setRevealedLetters] = useState(2)

    const inputRef = useRef(null)
    
    // Initialize with a random word
    useEffect(() => {
        selectNewWord()
    }, [])

    const selectNewWord = async () => {
        
        setTargetWord((quickTimeEvent.data.word).toUpperCase())
        setRevealedLetters(Math.min(2, quickTimeEvent.data.word.length))
    }


    // Global key listener - always capture input
    useEffect(() => {
        const handleGlobalKeyPress = (e) => {
            
            // Focus input on any alphanumeric key
            if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                if (inputRef.current) {
                    inputRef.current.focus()
                }
            }
        }


        window.addEventListener('keydown', handleGlobalKeyPress)
        return () => window.removeEventListener('keydown', handleGlobalKeyPress)

    }, [])

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
        answerQuick(answer)
    }

    useEffect(()=>{
        const endTime = questionInitTime + timeByQuestion * 1000;

        const timer = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(Math.floor((endTime - now) / 1000), 0);
        setTime(diff);

        if (diff <= 0) clearInterval(timer);
        }, 200); 

        return () => clearInterval(timer);
    },[questionInitTime])
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            {/* Score and Timer Bar */}
            {gameType=="room" && <div>{numberOfAnswers}/{room.numberOfPlayers}</div>}

            <div className={styles.timer}>{formatTime(time)}</div>


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
                    className={styles.hiddenInput}
                    autoComplete="off"
                    autoFocus
                />

                
            </div>
        </div>
    )
}