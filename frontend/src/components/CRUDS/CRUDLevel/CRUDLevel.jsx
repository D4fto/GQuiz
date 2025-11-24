import { createData, editData, deleteData } from "../../../utils/CRUDData";
import { useState, useEffect } from "react";
import { formatData } from "../../../utils/formatData";
import CRUD from "../../CRUD/CRUD";


export function CRUDLevel(){
  const [levels, setLevels] = useState({});
  const [worlds, setWorlds] = useState([]);
  
  async function loadLevels() {
    const levelResponse = await (
      await fetch(import.meta.env.VITE_API_URL + "/level", {
        credentials: "include",
      })
    ).json();
    setLevels(formatData(levelResponse.data));
  }
  async function loadWorlds() {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/world", {
        credentials: "include",
      })
    ).json();
    setWorlds(response.data);
  }
  useEffect(()=>{
    loadLevels()
    loadWorlds()
  },[])
  return <CRUD
    title={"Levels"}
    header={levels.header}
    data={levels.data}
    onDelete={async (id)=>{
      await deleteData("/level/", id).catch((e)=>{
        throw new Error(e)
      });
      loadLevels();
    }}
    onCreate={async (data)=>{
      if(!data.label){
        throw new Error("Nome do level vazio");
      }
      if(!data.number){
        throw new Error("Número do level vazio");
      }
      if(!data.id_world){
        throw new Error("Mundo do level vazio");
      }
      data.id_world = parseInt(data.id_world)
      data.number = parseInt(data.number)
      await createData("/level", JSON.stringify({data})).catch((e)=>{
        throw new Error(e)
      });
      loadLevels()
    }}
    onEdit={async (id, data)=>{
      if(!data.label){
        throw new Error("Nome do level vazio");
      }
      if(!data.number){
        throw new Error("Número do level vazio");
      }
      if(!data.id_world){
        throw new Error("Mundo do level vazio");
      }
      data.number = parseInt(data.number)
      data.id_world = parseInt(data.id_world)
      
      await editData("/level/", id, JSON.stringify({data})).catch((e)=>{
        throw new Error(e)
      });
      loadLevels()
    }}
    customInputs={{
      id_world: <div>
        <label htmlFor="id_world">mundo: </label>
        <select name="id_world" id="id_world" defaultValue="1">
          {
            worlds.map((e,i)=>{
              return <option key={i} value={e.id}>{e.id} - {e.name}</option>
            })
          }
        </select>
      </div>
    }}
  ></CRUD>
}