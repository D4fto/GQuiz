import { createData, editData, deleteData } from "../../../utils/CRUDData";
import { useState, useEffect } from "react";
import { formatData } from "../../../utils/formatData";
import CRUD from "../../CRUD/CRUD";

export function CRUDUserImgs(){
  const [useIMG, setUseIMG] = useState({});
  async function loadUseIMG() {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + "/user-imgs", {
        credentials: "include",
      })
    ).json();
    setUseIMG(formatData(response.data));
  }
  useEffect(()=>{
    loadUseIMG()
  },[])

  return <CRUD
    title={"img"}
    header={useIMG.header}
    data={useIMG.data}
    onDelete={async (id)=>{
      await deleteData('/user-imgs/', id)
      loadUseIMG()
    }}
    onCreate={async (data)=>{
      await createData("/user-imgs", JSON.stringify(data));
      loadUseIMG()
    }}
    onEdit={async (id, data)=>{
      await editData("/user-imgs/", id, JSON.stringify({data}));
      loadUseIMG()
    }}
  ></CRUD>
}