import styles from "./RoomCreationPt2.module.css";
import BackButton from "../../components/BackButton/BackButton";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import group from "../../assets/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import { useState } from "react";
import formatTime, {extractSeconds} from "../../utils/formatTime";
import { useGame } from "../../contexts/gameContext";
import { toast } from 'react-hot-toast'
import Category from "../Category/Category";


export default function RoomCreationPt2() {
  const [time, setTime] = useState("0:30");
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [hasQuickTime, setHasQuickTime] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [categoryIds, setCategoryIds] = useState(false)
  const { startRoomGame, toHome } = useGame()

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
    startRoomGame(parseInt(numberOfQuestions), extractSeconds(time), categoryIds, hasQuickTime)

  }
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        {
          categoryOpen&&
          <Category setCategoryIds={setCategoryIds} setShowing={setCategoryOpen} categoriesIds={categoryIds}></Category>
        }
        <div className={styles.topTab}>Criação de Sala</div>

        <div className={styles.card}>
          <div className={styles.leftArea}>
            <img src={group} className={styles.group} alt="group" />
          </div>

          <form className={styles.rightArea} onSubmit={handleSubmit}>
            <h2>Configurações</h2>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Nº de perguntas</label>
                <input type="number" placeholder="0" value={numberOfQuestions} onChange={handleNumberQuestionsChange} required/>
              </div>

              <div className={styles.field}>
                <label>Tempo por pergunta</label>
                <input type="text" placeholder="0:00" value={time} onChange={handleTimeChange} required/>
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

            <button className={styles.playBtn}>Criar</button>
          </form>

          <BackButton classes={styles.boto} onClick={toHome}/>
        </div>
      </div>

      <div>
        <StyleSquare
          option={2}
          innerColor={"var(--primary-dark)"}
          outColor={"var(--primary)"}
          position={"bottomRight"}
        />
      </div>
    </div>
  );
}
