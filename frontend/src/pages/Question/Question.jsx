
import styles from "./Question.module.css";
import React, { useState, useEffect } from 'react';
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import { useGame } from "../../contexts/gameContext";
import NextButton from "../../components/NextButton/NextButton";

  export default function Question() {
    const { actualQuestion, answerQuestion, questionInitTime, timeByQuestion, gameType, room, numberOfAnswers } = useGame()
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null);
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
  
  
    return (
      <div className={styles.container}>
        <StyleSquare option={1} innerColor={'var(--black)'} outColor={'var(--gray)'} position={'bottomLeft'}></StyleSquare>
          <div className={styles.timer}>{formatTime(time)}</div>
          {gameType=="room" && <div className={styles.answereds}>{numberOfAnswers}/{room.numberOfPlayers}</div>}
        
  
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
  
        <NextButton onClick={()=>{answerQuestion(selectedOption)}}></NextButton>
  
      </div>
    );
  };
