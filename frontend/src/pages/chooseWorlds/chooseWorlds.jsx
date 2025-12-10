import styles from "./chooseWorlds.module.css";
import TitleBox from "../../components/TitleBox/TitleBox";
import StyleSquare from "../../components/StyleSquare/StyleSquare";
import ChooseWorlds from "../../components/ChooseWorlds/ChooseWorlds";
import BackButton from "../../components/BackButton/BackButton";


export default function chooseWorlds(){


    return (
    <div className={styles.chooseWorlds}>
      <StyleSquare option={2} innerColor={'var(--gray)'} outColor={'var(--black)'} position={'bottomRight'}></StyleSquare>
      <main className={styles.main}>
        <div className={styles.boxWorlds}>
            <div className={styles.Worlds}>
                <TitleBox title="Mundos" />
            </div>
        </div>
        <ChooseWorlds/>
      </main>
      <BackButton/>
    </div>
  );
    
}
