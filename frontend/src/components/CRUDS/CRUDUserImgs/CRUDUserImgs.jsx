import { createData, editData, deleteData } from "../../../utils/CRUDData";
import { useState, useEffect } from "react";
import { formatData } from "../../../utils/formatData";
import CRUD from "../../CRUD/CRUD";

export function CRUDUserImgs(){
  const [worlds, setWorlds] = useState({});
  async function loadWorlds() {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/user-imgs", {
        credentials: "include",
      })
    ).json();
    setWorlds(formatData(response.data));
  }
  useEffect(()=>{
    loadWorlds()
  },[])

  return <CRUD
    title={"img"}
    header={worlds.header}
    data={worlds.data}
    onDelete={async (id)=>{
      await deleteData('/user-imgs/', id)
      loadWorlds()
    }}
    onCreate={async (data)=>{
      await createData("/user-imgs", JSON.stringify(data));
      loadWorlds()
    }}
    onEdit={async (id, data)=>{
      await editData("/user-imgs/", id, JSON.stringify({data}));
      loadWorlds()
    }}
  ></CRUD>
}