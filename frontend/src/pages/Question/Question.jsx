
import styles from "./Question.module.css";
import React, { useState, useEffect } from 'react';
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import { useGame } from "../../contexts/gameContext";

  export default function Question() {
    const { actualQuestion, answerQuestion, questionInitTime, timeByQuestion } = useGame()
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null);
    const [buttonHovered, setButtonHovered] = useState(false);
    const [options, setOptions] = useState([])
    const [time, setTime] = useState(timeByQuestion);
  
    useEffect(() => {
      if(!actualQuestion.option){
        return
      }
      const newOptions = actualQuestion.option.map((e,i)=>{
        e.id = i
        return e
      });
      setOptions(newOptions)
      
    }, []);

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
        <StyleSquare option={1} innerColor={'var(--black)'} outColor={'var(--gray)'} position={'bottomLeft'}></StyleSquare>
          <div className={styles.timer}>{formatTime(time)}</div>
        
  
        <div className={styles.mainContent}>
          <div className={styles.questionCard}>
            <h2 className={styles.questionTitle}>{actualQuestion.title}</h2>
            
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
                  <span className={styles.optionText}>{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className={styles.bottomLeftCard}>
          Pergunta 01
        </div>
  
        <div
          onClick={()=>{answerQuestion(selectedOption)}}
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
