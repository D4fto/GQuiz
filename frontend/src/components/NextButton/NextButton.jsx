import styles from './NextButton.module.css'
import { useState } from 'react';
export default function NextButton({onClick,classes}){
    const [buttonHovered, setButtonHovered] = useState(false);
    return(
        <div
            onClick={onClick}
            className={`${styles.nextButton} ${classes} ${
            buttonHovered ? styles.nextButtonHover : ''
            }`}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            >
            <div className={styles.arrow}></div>
        </div>
        );
}