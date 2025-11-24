import { createData, editData, deleteData } from "../../../utils/CRUDData";
import { useState, useEffect } from "react";
import { formatData } from "../../../utils/formatData";
import CRUD from "../../CRUD/CRUD";


export function CRUDUser(){
  const [users, setUsers] = useState({});
  async function loadUsers() {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/user", {
        credentials: "include",
      })
    ).json();
    console.log(formatData(response.data.map((e)=>{
      e.isAdmin = String(e.isAdmin)
      return e
    })))
    setUsers(formatData(response.data));
  }
  useEffect(()=>{
    loadUsers()
  },[])
  return <CRUD
    title={"Users"}
    header={users.header}
    data={users.data}
    customInputs={{
      isAdmin: <div>
        <label htmlFor="isAdmin">isAdmin</label>
        <input type="checkbox" name="isAdmin" id="isAdmin" onChange={e=>console.log("kjdfbnfd")} onInput={e=>console.log("asaassasa")}/>
      </div>
    }}
    onDelete={async (id)=>{
      await deleteData("/user/", id).catch((e)=>{
        throw new Error(e)
      });
      loadUsers();
    }}
    onCreate={async (data)=>{
      if(!data.email){
        throw new Error("email do user vazio");
      }
      if(!data.username){
        throw new Error("username do user vazio");
      }
      if(data.id_userImg){
        data.id_userImg = parseInt(data.id_userImg)
      }else{
        delete data.id_userImg
      }
      if(data.points){
        data.points = parseInt(data.points)
      }else{
        delete data.points
      }
      await createData("/user", JSON.stringify({data})).catch((e)=>{
        throw new Error(e)
      });
      loadUsers()
    }}
    onEdit={async (id, data)=>{
      if(!data.email){
        throw new Error("email do user vazio");
      }
      if(!data.username){
        throw new Error("username do user vazio");
      }
      if(data.id_userImg){
        data.id_userImg = parseInt(data.id_userImg)
      }
      if(data.points){
        data.points = parseInt(data.points)
      }
      
      
      await editData("/user/", id, JSON.stringify({data})).catch((e)=>{
        throw new Error(e)
      });
      loadUsers()
    }}
  ></CRUD>
}