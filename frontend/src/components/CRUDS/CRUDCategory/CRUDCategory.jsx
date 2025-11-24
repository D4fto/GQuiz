import { createData, editData, deleteData } from "../../../utils/CRUDData";
import { useState, useEffect } from "react";
import { formatData } from "../../../utils/formatData";
import CRUD from "../../CRUD/CRUD";


export function CRUDCategory(){
  const [categories, setCategories] = useState({});
  async function loadCategories() {
    const categoryResponse = await (
      await fetch(import.meta.env.VITE_API_URL + "/category", {
        credentials: "include",
      })
    ).json();
    setCategories(formatData(categoryResponse.data));
  }
  useEffect(()=>{
    loadCategories()
  },[])
  return <CRUD
    title={"Categorias"}
    header={categories.header}
    data={categories.data}
    onDelete={async (id)=>{
      await deleteData("/category/", id).catch((e)=>{
        throw new Error(e)
      });
      loadCategories();
    }}
    onCreate={async (data)=>{
      if(!data.name){
        throw new Error("Nome da categoria vazio");
      }
      await createData("/category", JSON.stringify(data)).catch((e)=>{
        throw new Error(e)
      });
      loadCategories()
    }}
    onEdit={async (id, data)=>{
      if(!data.name){
        throw new Error("Nome da categoria vazio");
      }
      await editData("/category/", id, JSON.stringify({data})).catch((e)=>{
        throw new Error(e)
      });
      loadCategories()
    }}
  ></CRUD>
}