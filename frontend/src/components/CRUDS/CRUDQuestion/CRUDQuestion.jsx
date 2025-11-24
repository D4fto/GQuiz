import { createData, editData, deleteData } from "../../../utils/CRUDData";
import { useState, useEffect } from "react";
import { formatData } from "../../../utils/formatData";
import CRUD from "../../CRUD/CRUD";

async function editOptions(body) {

  try {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + '/option/update-many', {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
    ).json();
    if (response.error) {
      console.error(response.error);
      throw new Error(response.error);
    }
  } catch (e) {
    console.error(e);
  }
}

export function CRUDQuestion(){
  const [questions, setQuestions] = useState({});
  const [categories, setCategories] = useState([]);

  async function loadCategories() {
    const categoryResponse = await (
      await fetch(import.meta.env.VITE_API_URL + "/category", {
        credentials: "include",
      })
    ).json();
    setCategories(categoryResponse.data);
  }

  async function loadQuestions() {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/question", {
        credentials: "include",
      })
    ).json();
    response.data.map((e)=>{
        e.corrects=[]
        e.wrongs=[]
        e.option.map((row)=>{
          if(row.isCorrect){
            e.corrects.push(row.label)
            return
          }
          e.wrongs.push(row.label)
          
        })
        e.corrects = e.corrects.join(';')
        e.wrongs = e.wrongs.join(';')
        e.option = JSON.stringify(e.option)
        return e
    })
    setQuestions(formatData(response.data));
  }

  useEffect(()=>{
    loadQuestions()
    loadCategories()
  },[])

  return <CRUD
    title={"questoes"}
    header={questions.header}
    data={questions.data}
    onDelete={async (id)=>{
      await deleteData('/question/', id)
      loadQuestions()
    }}
    onCreate={async (data)=>{
      if(!data.title){
        throw new Error("Titulo não pode ser vazio");
        
      }
      data.data = {
        title: data.title
      }
      delete data.title
      delete data.option
      const toIgnore = ['data', 'wrongs', 'corrects']
      const toNumber = ['weight', 'id_category']
      Object.keys(data).forEach((key)=>{
        if(toIgnore.includes(key)){
          return
        }
        if(data[key]){
          data.data[key] = data[key]
          if(toNumber.includes(key)){
            data.data[key] = Number(data.data[key])
          }
        }
        delete data[key]
      })
      data.corrects = data.corrects.split(';')
      data.wrongs = data.wrongs.split(';')
      await createData("/question", JSON.stringify(data));
      loadQuestions()
    }}
    onEdit={async (id, data)=>{
      if(!data.title){
        throw new Error("Titulo não pode ser vazio");
      }
      data.data = {
        title: data.title
      }
      delete data.title
      const dataOption = {data: JSON.parse(data.option)}
      delete data.option
      delete data.corrects
      delete data.wrongs
      const toIgnore = ['data']
      const toNumber = ['weight', 'id_category']
      Object.keys(data).forEach((key)=>{
        if(toIgnore.includes(key)){
          return
        }
        if(data[key]){
          data.data[key] = data[key]
          if(toNumber.includes(key)){
            data.data[key] = Number(data.data[key])
          }
        }
        delete data[key]
      })
      dataOption.data = dataOption.data.map((e)=>{
        e.id_question = id
        return e
      })
      await editData("/question/", id, JSON.stringify(data));
      await editOptions(JSON.stringify(dataOption))
      loadQuestions()
    }}
    customInputs={{
      id_category: <div>
        <label htmlFor="id_category">categoria: </label>
        <select name="id_category" id="id_category" defaultValue="1">
          {
            categories.map((e,i)=>{
              return <option key={i} value={e.id}>{e.name}</option>
            })
          }
        </select>
      </div>
    }}
  ></CRUD>
}