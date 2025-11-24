import styles from './CRUD.module.css'
import { useState, useRef } from 'react'
import MainButton from '../MainButton/MainButton'
import { toast } from 'react-hot-toast'


export default function CRUD({title, header = [], data = [], onDelete, onEdit, onCreate, idIndex = 0, customInputs = {}}){
  const [formState, setFormState] = useState('criar')
  const [selectedId, setselectedId] = useState(-1)
  const formRef = useRef(null)
  function clearForm(){
    const input = formRef.current.querySelectorAll("input");
    for (const element of input) {
      if (element.type=="checkbox"){
        element.checked=false
      }
      element.value=''
    }
  }
  function handleSubmit(event){
    event.preventDefault()
    const data = {}
    header.map((e,i)=>{
      if(i===idIndex){
        return
      }
      if(event.target[e].type == "checkbox"){
        data[e] = event.target[e].checked
        return
      }
      data[e] = event.target[e].value
    })
    if(formState=='editar'){
      setFormState('carregando')
      const response = onEdit(selectedId, data)
      toast.promise(response, {
        loading: `Tentando editar ${title}`,
        success: title + ' editado com sucesso',
        error: (e) => `Erro ao editar ${title}: ${e}`,
      })
      return response.then(()=>{
        clearForm()
        setselectedId(-1)
        setFormState('criar')
      }).catch((e)=>{
        setFormState('editar')
      })
    }
    setFormState('carregando')
    const response = onCreate(data)
    toast.promise(response, {
      loading: `Tentando criar ${title}`,
      success: title + ' criado com sucesso',
      error: (e) => `Erro ao criar ${title}: ${e}`,
    })
    return response.then(()=>{
      setFormState('criar')
      clearForm()
    }).catch((e)=>{
      setFormState('criar')
    })
  }
  function changeToEdit(row){
    setFormState('editar')
    setselectedId(row[idIndex])
    row.map((value,i)=>{
      if(i===idIndex){
        return
      }
      const input = formRef.current.querySelector(`[name="${header[i]}"]`);

      if (input) {
        if(input.type=="checkbox"){
          input.checked = value == "true"
          input.value = value == "true";
          return
        }
        input.value = value;
      }
    })
  }
  return <div className={styles.crud}>
    <h1 className={styles.title}>Manter {title}</h1>
    <div className={styles.main}>
      <div className={styles.tableContainer}>
        <table >
          <thead>
            <tr>
              {header.map((e,i)=>{
                return <th key={i}>{e}</th>
              })}
              <th className={styles.actions}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((e,i)=>{
                return <tr key={i+"r"}>
                  {e.map((x,j)=>{
                    return <td key={j+'d'}>{x}</td>
                  })}
                  <td className={styles.actions}>
                    <div className={styles.actionsContainer}>
                      <button onClick={()=>changeToEdit(e)} className={styles.editButton}>Editar</button>
                      <button 
                        onClick={()=>{
                          const response = onDelete(e[idIndex])
                          toast.promise(response, {
                            loading: `Tentando deletar ${title}`,
                            success: `${title} deletado com sucesso`,
                            error: (e) => `Erro ao deletar ${title}: ${e}`,
                          })
                          return response
                          } 
                        }
                        className={styles.deleteButton}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
        <h2 className={styles.formTitle}>{formState.toUpperCase()} {title}</h2>
        <div className={styles.inputsContainer}>
          {
            header.map((e,i)=>{
              if(i===idIndex){
                return
              }
              if(customInputs[e]){
                return customInputs[e]
              }
              return <div key={i}>
                <label htmlFor={e}>{e}:</label>
                <input type="text" name={e} id={e} placeholder={e}/>
              </div>
            })
          }
        </div>
        <MainButton classes={styles.submitButton} type='submit' options={{disabled:formState=="carregando"}} text={`${formState.toUpperCase()} ${title}`}></MainButton>
      </form>
    </div>
  </div>
}