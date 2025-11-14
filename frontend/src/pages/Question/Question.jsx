
import styles from "./Question.module.css";
import React, { useState, useEffect } from 'react';
import StyleSquare from "../../components/StyleSquare/StyleSquare";

  export default function Question() {
    const [selectedOption, setSelectedOption] = useState(2);
    const [hoveredOption, setHoveredOption] = useState(null);
    const [buttonHovered, setButtonHovered] = useState(false);
    const [time, setTime] = useState(60);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }, []);
  
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
  
    const options = [
      { id: 1, text: 'Resposta 01' },
      { id: 2, text: 'Resposta 02' },
      { id: 3, text: 'Resposta 03' },
      { id: 4, text: 'Resposta 04' },
    ];
  
    return (
      <div className={styles.container}>
        <StyleSquare option={1} innerColor={'var(--black)'} outColor={'var(--gray)'} position={'bottomLeft'}></StyleSquare>
          <div className={styles.timer}>{formatTime(time)}</div>
        
  
        <div className={styles.mainContent}>
          <div className={styles.questionCard}>
            <h2 className={styles.questionTitle}>Pergunta</h2>
            
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
  
            <div className={styles.optionsList}>
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`${styles.option} ${
                    hoveredOption === option.id ? styles.optionHover : ''
                  } ${selectedOption === option.id ? styles.optionSelected : ''}`}
                  onMouseEnter={() => setHoveredOption(option.id)}
                  onMouseLeave={() => setHoveredOption(null)}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <div
                    className={`${styles.radio} ${
                      selectedOption === option.id ? styles.radioSelected : ''
                    }`}
                  >
                    {selectedOption === option.id && (
                      <div className={styles.radioInner}></div>
                    )}
                  </div>
                  <span className={styles.optionText}>{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className={styles.bottomLeftCard}>
          Pergunta 01
        </div>
  
        <div
          className={`${styles.nextButton} ${
            buttonHovered ? styles.nextButtonHover : ''
          }`}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
        >
          <div className={styles.arrow}></div>
        </div>
      </div>
    );
  };
