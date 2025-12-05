import styles from "./ColorQuestion.module.css"

export default function ColorQuestion({ 
    targetColor = "vermelho", 
    colorOptions = [], 
    onAnswer = () => {} 
}) {
    return (
        <div className={styles.container}>
            <div className={styles.questionCard}>
                <h1 className={styles.instruction}>Clique na cor</h1>
                <h2 className={styles.targetColor}>{targetColor}</h2>
                
                <div className={styles.optionsGrid}>
                    {colorOptions && colorOptions.map((option, index) => (
                        <div
                            key={index}
                            className={styles.colorOption}
                            style={{ backgroundColor: option.hex }}
                            onClick={() => onAnswer(option.name)}
                            aria-label={option.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}