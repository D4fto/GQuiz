import stylesCRUD from '../CRUD.module.css'
import styles from './CRUDNM.module.css'
import MainButton from '../../MainButton/MainButton';
import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast'


export default function CRUDNM({table1Name, table2Name, table1Data, table2Data, getRelationData, relationHeader, onCreateRelation, onDeleteRelation, idIndex = 0}){
  const [selectedTable1, setSelectedTable1] = useState(-1)
  const [selectedTable2, setSelectedTable2] = useState(-1)
  const [relationData, setRelationData] = useState([])
  const [table2Ids, setTable2Ids] = useState([])
  function refreshRelationData(){
    const response = getRelationData(selectedTable1)
    toast.promise(response, {
      loading: `Carregando os dados`,
      success: `Dados carregados com sucesso`,
      error: (e) => `Erro ao carregar os dados: ${e}`,
    })
    response.then((e)=>{
      setRelationData(e)
      const newTable2Ids = []
      e.map((x)=>{
        newTable2Ids.push(x[relationHeader[idIndex]])
      })
      setTable2Ids(newTable2Ids)
    }).catch((e)=>{
      setRelationData([])
      setTable2Ids([])
    })
  }

  useEffect(()=>{
    refreshRelationData()
    
  },[selectedTable1])
  useEffect(()=>{
    if(table1Data.length > 0 && selectedTable1 ===-1){
      setSelectedTable1(table1Data[0].value)
    }
    if(table2Data.length > 0 && selectedTable2 ===-1){
      setSelectedTable2(table2Data[0].value)
    }    
  },[table1Data, table2Data])
  
  return <div className={stylesCRUD.crud}>
    
    <div className={styles.tables}>
      <div className={styles.inputGroup}>
        <label htmlFor={table1Name}>{table1Name}: </label>
        <select name={table1Name} id={table1Name} onChange={(e)=>setSelectedTable1(e.target.value)} value={selectedTable1}>
          {
            table1Data.map((e, i)=>{
              return <option value={e.value} key={i}>{e.text}</option>
            })
          }
        </select>
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor={table2Name}>{table2Name}: </label>
        <select name={table2Name} id={table2Name} onChange={(e)=>setSelectedTable2(e.target.value)} value={selectedTable2}>
          {
            table2Data.map((e, i)=>{
              return <option value={e.value} key={i}>{e.text}</option>
            })
          }
        </select>
      </div>
      <MainButton classes={styles.addButton} options={{disabled: table2Ids.includes(parseInt(selectedTable2))}} onClick={() => {
        const response = onCreateRelation(selectedTable1, selectedTable2) 
        toast.promise(response, {
          loading: `Criando relação`,
          success: `Relação criada com sucesso`,
          error: (e) => `Erro ao criar relação: ${e}`,
        })
        response.then(()=>{
        refreshRelationData()
      })}} text={`Adicionar ${table2Name} para ${table1Name}`}></MainButton>
    </div>
    <div className={stylesCRUD.tableContainer}>
      <table>
        <thead>
          <tr>
            {
              relationHeader.map((e, i)=>{
                return <th key={i}>
                  {e}
                </th>
              })
            }
            <th className={stylesCRUD.actions}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {
            relationData.map((e, i)=>{
              return <tr key={i}>
                {
                  <>
                    {
                      relationHeader.map((x, k)=>{
                        return <td key={k}>{e[x]}</td>
                      })
                    }
                    <td className={stylesCRUD.actions}>
                      <button onClick={()=>{
                        const response = onDeleteRelation(selectedTable1,e[relationHeader[idIndex]])
                        toast.promise(response, {
                          loading: `Deletando relação`,
                          success: `Relação deletada com sucesso`,
                          error: (e) => `Erro ao deletar relação: ${e}`,
                        })
                        response.then(()=>{
                        refreshRelationData()
                      })}} className={stylesCRUD.deleteButton}>Remover</button>
                    </td>
                  </>
                }
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  </div>
}
