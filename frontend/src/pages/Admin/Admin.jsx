import styles from "./Admin.module.css";
import { useState } from "react";
import { CRUDCategory, CRUDOption, CRUDWorld, CRUDQuestion, CRUDLevelHasQuestion, CRUDLevel, CRUDUser, CRUDUserHasLevel, CRUDUserImgs } from "../../components/CRUDS/CRUDS";

export default function Admin() {
  const [adminState, setAdminState] = useState("categorias");
  
  
  

  const cruds = {
    categorias: <CRUDCategory></CRUDCategory>,
    mundos: <CRUDWorld></CRUDWorld>,
    levels: <CRUDLevel></CRUDLevel>,
    users: <CRUDUser></CRUDUser>,
    opções: <CRUDOption></CRUDOption>,
    img: <CRUDUserImgs></CRUDUserImgs>,
    questoes:
      <>
        <p>Utilize a coluna <strong>option</strong> para editar e as conlunas <strong>corrects</strong> e <strong>wrongs</strong> para criar</p>
        <CRUDQuestion></CRUDQuestion>
      </>,
    "fases - questoes": <CRUDLevelHasQuestion></CRUDLevelHasQuestion>,
    "usuarios - fases": <CRUDUserHasLevel></CRUDUserHasLevel>,
  };


  return (
    <div className={styles.admin}>
      <h1>Admin</h1>
      <div className={styles.main}>
        <fieldset className={styles.crudSelection}>
          <legend>Escolha o que manter</legend>
          {Object.keys(cruds).map((key) => {
            return (
              <div>
                <input
                  type="radio"
                  name="crud"
                  value={key}
                  id={key}
                  onClick={() => setAdminState(key)}
                />
                <label htmlFor={key}>{key}</label>
              </div>
            );
          })}
        </fieldset>
        <div className={styles.crud}>{cruds[adminState]}</div>
      </div>
    </div>
  );
}
