import { createData, editData, deleteData } from "../../../utils/CRUDData";
import { useState, useEffect } from "react";
import { formatData } from "../../../utils/formatData";
import CRUD from "../../CRUD/CRUD";

export function CRUDWorld(){
  const [worlds, setWorlds] = useState({});
  async function loadWorlds() {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/world", {
        credentials: "include",
      })
    ).json();
    setWorlds(formatData(response.data));
  }
  useEffect(()=>{
    loadWorlds()
  },[])

  return <CRUD
    title={"mundos"}
    header={worlds.header}
    data={worlds.data}
    onDelete={async (id)=>{
      await deleteData('/world/', id)
      loadWorlds()
    }}
    onCreate={async (data)=>{
      await createData("/world", JSON.stringify(data));
      loadWorlds()
    }}
    onEdit={async (id, data)=>{
      await editData("/world/", id, JSON.stringify({data}));
      loadWorlds()
    }}
  ></CRUD>
}