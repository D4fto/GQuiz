import styles from "./chooseWorlds.module.css";
import TitleBox from "../../components/TitleBox/TitleBox";
import ChooseWorlds from "../../components/ChooseWorlds/ChooseWorlds";


export default function chooseWorlds(){


    return (
    <div className={styles.chooseWorlds}>

      <main className={styles.main}>
        <div className={styles.boxWorlds}>
            <div className={styles.Worlds}>
                <TitleBox title="Mundos" />
            </div>
        </div>
        <ChooseWorlds/>
      </main>
    </div>
  );
    
}
