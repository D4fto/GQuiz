import { createData, editData, deleteData } from "../../../utils/CRUDData";
import { useState, useEffect } from "react";
import { formatData } from "../../../utils/formatData";
import CRUD from "../../CRUD/CRUD";


export function CRUDOption(){
  const [option, setOption] = useState({});
  const [question, setWorlds] = useState([]);
  async function loadOption() {
    const optionResponse = await (
      await fetch(import.meta.env.VITE_API_URL + "/option", {
        credentials: "include",
      })
    ).json();
    console.log(formatData(optionResponse.data.map((e)=>{
      e.isCorrect = String(e.isCorrect)
      return e
    })))
    setOption(formatData(optionResponse.data));
  }
  async function loadQuestion() {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/question", {
        credentials: "include",
      })
    ).json();
    setWorlds(response.data);
  }
  useEffect(()=>{
    loadOption()
    loadQuestion()
  },[])
  return <CRUD
    title={"Opcoes"}
    header={option.header}
    data={option.data}
    customInputs={{
      isCorrect: <div>
        <label htmlFor="isCorrect">isCorrect</label>
        <input type="checkbox" name="isCorrect" id="isCorrect" onChange={e=>console.log("kjdfbnfd")} onInput={e=>console.log("asaassasa")}/>
      </div>,
      id_question: <div>
      <label htmlFor="id_question">mundo: </label>
      <select name="id_question" id="id_question" defaultValue="1">
        {
          question.map((e,i)=>{
            return <option key={i} value={e.id}>{e.id} - {e.title}</option>
          })
        }
      </select>
    </div>
    }}
    onDelete={async (id)=>{
      await deleteData("/option/", id).catch((e)=>{
        throw new Error(e)
      });
      loadOption();
    }}
    onCreate={async (data)=>{
      if(!data.label){
        throw new Error("Nome da opção vazio");
      }
      data.id_question = parseInt(data.id_question)
      await createData("/option", JSON.stringify(data)).catch((e)=>{
        throw new Error(e)
      });
      loadOption()
    }}
    onEdit={async (id, data)=>{
      if(!data.label){
        throw new Error("Nome da opção vazio");
      }
      data.id_question = parseInt(data.id_question)
      await editData("/option/", id, JSON.stringify({data})).catch((e)=>{
        throw new Error(e)
      });
      loadOption()
    }}
  ></CRUD>
}