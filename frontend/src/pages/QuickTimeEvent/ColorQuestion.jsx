
import styles from "./ColorQuestion.module.css";
import React, { useState, useEffect } from 'react';
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import { useGame } from "../../contexts/gameContext";
import NextButton from "../../components/NextButton/NextButton";

  export default function Question() {
    const { 
      quickTimeEvent, 
      answerQuick, 
      gameType,
      room,
      numberOfAnswers,
      questionInitTime, 
      timeByQuestion, } = useGame()
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null);
    const [options, setOptions] = useState([])
    const [time, setTime] = useState(timeByQuestion);
  
    useEffect(() => {
      if(!quickTimeEvent.data.options){
        return
      }
      const newOptions = quickTimeEvent.data.options
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
          {gameType=="room" && <div>{numberOfAnswers}/{room.numberOfPlayers}</div>}
        
  
        <div className={styles.mainContent}>
          <div className={styles.questionCard}>
            <h2 className={styles.questionTitle}>{`Selecione a ${quickTimeEvent.data.type==="color"?"cor":"palavra"}: `}<span style={{color: quickTimeEvent.data.correct.cor}}>{quickTimeEvent.data.correct.nome}</span></h2>
            
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
  
            <div className={styles.optionsList}>
              {options.map((option) => (
                <div
                  key={option.index}
                  className={`${styles.option} ${
                    hoveredOption === option.index ? styles.optionHover : ''
                  } ${selectedOption === option.index ? styles.optionSelected : ''}`}
                  onMouseEnter={() => setHoveredOption(option.index)}
                  onMouseLeave={() => setHoveredOption(null)}
                  onClick={() => setSelectedOption(option.index)}
                >
                  <div
                    className={`${styles.radio} ${
                      selectedOption === option.index ? styles.radioSelected : ''
                    }`}
                  >
                    {selectedOption === option.index && (
                      <div className={styles.radioInner}></div>
                    )}
                  </div>
                  <span className={styles.optionText} style={{
                    color: option.cor
                  }}>{option.nome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <NextButton onClick={()=>{answerQuick(selectedOption)}}></NextButton>
  
      </div>
    );
  };
