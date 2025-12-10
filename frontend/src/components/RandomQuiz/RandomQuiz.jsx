import styles from "./RandomQuiz.module.css";
import dice from "../../assets/dice.svg"
import { useState } from "react";
import formatTime, {extractSeconds} from "../../utils/formatTime";
import { useGame } from "../../contexts/gameContext";
import { toast } from 'react-hot-toast'
import Category from "../Category/Category";

export default function RandomQuiz() {
  const [time, setTime] = useState("0:30");
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [hasQuickTime, setHasQuickTime] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [categoryIds, setCategoryIds] = useState(false)
  const { startRandom } = useGame()

  function handleNumberQuestionsChange(e){
    if(!e.target.value){
      setNumberOfQuestions("")
      return
    }
    if(parseInt(e.target.value)>20){
      setNumberOfQuestions(20)
      return
    }
    if(parseInt(e.target.value)<1){
      setNumberOfQuestions(1)
      return
    }
    setNumberOfQuestions(parseInt(e.target.value))
    return
  }

  function handleTimeChange(e){
    const formatted = formatTime(e.target.value);
    setTime(formatted);
  };

  function handleSubmit(e){
    e.preventDefault()
    if(numberOfQuestions==""){
      return toast.error("Nº de perguntas vazio")
    }
    if(!extractSeconds(time)){
      return toast.error("Tempo por questão vazio")
    }
    console.log(hasQuickTime)
    startRandom(parseInt(numberOfQuestions), extractSeconds(time), categoryIds, hasQuickTime)

  }
  return (
    <div className={styles.page}>
      {
        categoryOpen&&
        <Category setCategoryIds={setCategoryIds} setShowing={setCategoryOpen} categoriesIds={categoryIds}></Category>
      }
      <div className={styles.topTab}>Quiz Aleatório</div>

      <div className={styles.card}>
        <div className={styles.leftArea}>
          <img src={dice} className={styles.dice} />
        </div>

        <form className={styles.rightArea} onSubmit={handleSubmit}>
          <h2>Configurações</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nº de perguntas</label>
              <input type="number" placeholder="0" onChange={handleNumberQuestionsChange} value={numberOfQuestions} required/>
            </div>

            <div className={styles.field}>
              <label>Tempo por pergunta</label>
              <input type="text" placeholder="0:00" onChange={handleTimeChange} value={time} required/>
            </div>
          </div>

          <div className={styles.field}>
            <label>Categoria</label>
            <p className={styles.categoryInput} onClick={()=>setCategoryOpen(true)}>
              {categoryIds?"Personalizado":"Todos"}
            </p>
          </div>


            <div className={styles.checkboxRow}>
              <input type="checkbox" id="qte" className={styles.checkbox} checked={hasQuickTime} onChange={e=>setHasQuickTime(e.target.checked)}/>
              <label htmlFor="qte">Quick Time Events</label>
            </div>


          <p className={styles.divirta}>Divirta-se !</p>
          <div className={styles.stake}></div>

          <button className={styles.playBtn}>Jogar</button>
        </form>
      </div>
    </div>
  );
}

