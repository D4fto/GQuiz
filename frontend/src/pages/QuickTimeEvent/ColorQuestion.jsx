import styles from "./ColorQuestion.module.css";
import React, { useState, useEffect } from 'react';
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import NextButton from "../../components/NextButton/NextButton";

export default function Question() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [targetColor, setTargetColor] = useState("");
  const [time, setTime] = useState(10);
  
  // Controla qual modo de jogo: "color" = selecionar pela cor | "word" = selecionar pela palavra
  const [corControl, setCorControl] = useState("word"); // ou "word"

  const colors = [
    { name: "AZUL", color: "#0000FF", id: 1 },
    { name: "PRETO", color: "#000000", id: 2 },
    { name: "AMARELO", color: "#FFD700", id: 3 },
    { name: "VERDE", color: "#008000", id: 4 },
    { name: "VERMELHO", color: "#FF0000", id: 5 },
    { name: "ROXO", color: "#800080", id: 6 },
    { name: "LARANJA", color: "#FF8C00", id: 7 },
    { name: "ROSA", color: "#FF69B4", id: 8 },
    { name: "MARROM", color: "#8B4513", id: 9 },
    { name: "CINZA", color: "#808080", id: 10 }
  ];

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateQuestion = () => {
    // Seleciona 4 cores aleatórias
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const selectedColors = shuffled.slice(0, 4);
    
    // Define qual é a cor alvo (a cor que aparece no título)
    const target = selectedColors[Math.floor(Math.random() * selectedColors.length)];
    setTargetColor(target);

    // Gera as opções embaralhando as cores e palavras
    const generatedOptions = selectedColors.map((colorObj, index) => {
      // Pega uma palavra aleatória diferente da cor atual
      let randomWordColor;
      do {
        randomWordColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
      } while (randomWordColor.id === colorObj.id && selectedColors.length > 1);

      return {
        id: colorObj.id,
        label: randomWordColor.name, // A palavra escrita
        color: colorObj.color, // A cor real do texto
        colorName: colorObj.name, // Nome real da cor
        wordName: randomWordColor.name // Nome da palavra escrita
      };
    });

    setOptions(generatedOptions);

    // Define a resposta correta baseado no corControl
    if (corControl === "color") {
      // Resposta correta é quem tem a COR do texto igual à cor alvo
      const correct = generatedOptions.find(opt => opt.color === target.color);
      setCorrectAnswer(correct?.id);
    } else {
      // Resposta correta é quem tem a PALAVRA escrita igual ao nome alvo
      const correct = generatedOptions.find(opt => opt.label === target.name);
      setCorrectAnswer(correct?.id);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const answerQuestion = (answerId) => {
    if (answerId === correctAnswer) {
      console.log("Resposta correta!");
      // Aqui você pode adicionar lógica para pontuação, próxima pergunta, etc.
    } else {
      console.log("Resposta incorreta!");
    }
    
    // Gera nova pergunta após responder
    setTimeout(() => {
      setSelectedOption(null);
      generateQuestion();
      setTime(10);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <StyleSquare option={1} innerColor={'var(--black)'} outColor={'var(--gray)'} position={'bottomLeft'}></StyleSquare>
      <div className={styles.timer}>{formatTime(time)}</div>

      <div className={styles.mainContent}>
        <div className={styles.questionCard}>
          <h2 className={styles.questionTitle}>
            Selecione a {corControl === "color" ? "cor" : "palavra"}{" "}
            <span style={{ color: targetColor.color }}>{targetColor.name}</span>
          </h2>
          
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
                <span 
                  className={styles.optionText}
                  style={{ color: option.color }}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomLeftCard}>
        Pergunta 01
      </div>
      <NextButton onClick={() => { answerQuestion(selectedOption) }}></NextButton>
    </div>
  );
}