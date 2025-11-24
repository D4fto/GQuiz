import { useState, useEffect } from "react";
import CRUDNM from "../../CRUD/CRUDNM/CRUDNM";

export function CRUDUserHasLevel(){
  const [users, setUsers] = useState([])
  const [levels, setLevels] = useState([])

  async function loadUsers(){
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/user", {
        credentials: "include",
      })
    ).json();
    setUsers(response.data);
  }
  async function loadLevels(){
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/level", {
        credentials: "include",
      })
    ).json();
    setLevels(response.data);
  }
  async function loadLevelsFromUser(selected){
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/user/levels/" + selected, {
        credentials: "include",
      })
    ).json();
    return response.data.map((e)=>{
      return {
      id_level: e.id_level,
      max_points: e.max_points,
      id_world: e.level.id_world,
      number: e.level.number,
      label: e.level.label
    }
    })
  }
  async function removeLevelsFromUser(selected,id) {
    console.log(id)
    try{
      await fetch(import.meta.env.VITE_API_URL + "/user/levels/" + selected, {
        method: "delete",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({levels: [parseInt(id)]})
      })
    }catch(e){
      console.error(e)
    }
  }
  
  async function addLevelToUser(selected,id) {
    console.log(id)
    try{
      await fetch(import.meta.env.VITE_API_URL + "/user/levels/" + selected, {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({levels: [parseInt(id)]})
      })
    }catch(e){
      console.error(e)
    }
  }
  useEffect(()=>{
    loadUsers()
    loadLevels()
  },[])
  return <>
  
      <CRUDNM table1Name={"user"} 
      table2Name={"level"} 
      table1Data={users.map((e)=>{return {value: e.id, text: `${e.id} - ${e.email}`}})} 
      table2Data={levels.map((e)=>{return {value: e.id, text: `${e.id} - ${e.label}`}})}
      getRelationData={loadLevelsFromUser}
      relationHeader={["id_level", "max_points", "id_world", "number", "label"]}
      onCreateRelation={addLevelToUser}
      onDeleteRelation={removeLevelsFromUser}
      >
  
      </CRUDNM>
    </>
}