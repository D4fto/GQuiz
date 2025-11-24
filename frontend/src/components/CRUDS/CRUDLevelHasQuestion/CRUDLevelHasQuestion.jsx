import { useState, useEffect } from "react";
import CRUDNM from "../../CRUD/CRUDNM/CRUDNM";

export function CRUDLevelHasQuestion(){
  const [questions, setQuestions] = useState([])
  const [levels, setLevels] = useState([])

  async function loadQuestions(){
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/question/title/", {
        credentials: "include",
      })
    ).json();
    setQuestions(response.data);
  }
  async function loadLevels(){
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/level", {
        credentials: "include",
      })
    ).json();
    setLevels(response.data);
  }
  async function loadQuestionsFromLevel(selected){
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/level/questions/" + selected + '?type=simple', {
        credentials: "include",
      })
    ).json();
    return response.data.map((e)=>{
      return {
      id_question: e.id_question,
      title: e.question.title,
    }
    })
  }
  async function removeQuestionFromLevel(selected,id) {
    console.log(id)
    try{
      await fetch(import.meta.env.VITE_API_URL + "/level/questions/" + selected, {
        method: "delete",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({questions: [parseInt(id)]})
      })
    }catch(e){
      console.error(e)
    }
  }
  
  async function addLevelToWorld(selected,id) {
    console.log(id)
    try{
      await fetch(import.meta.env.VITE_API_URL + "/level/questions/" + selected, {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({questions: [parseInt(id)]})
      })
    }catch(e){
      console.error(e)
    }
  }
  useEffect(()=>{
    loadQuestions()
    loadLevels()
  },[])
  return <>
  
      <CRUDNM table1Name={"level"} 
      table2Name={"question"} 
      table1Data={levels.map((e)=>{return {value: e.id, text: `${e.id} - ${e.label}`}})}
      table2Data={questions.map((e)=>{return {value: e.id, text: `${e.id} - ${e.title}`}})} 
      getRelationData={loadQuestionsFromLevel}
      relationHeader={["id_question", "title"]}
      onCreateRelation={addLevelToWorld}
      onDeleteRelation={removeQuestionFromLevel}
      >
  
      </CRUDNM>
    </>
}