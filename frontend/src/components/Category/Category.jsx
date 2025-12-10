import React, { useState, useEffect } from 'react';
import styles from './Category.module.css';

const Category = ({setCategoryIds, setShowing, categoriesIds}) => {


  const [categories, setCategories] = useState([]);
  const [option, setOption] = useState("todos")

  async function fetchCategories() {
    try {
      const data = await(await fetch(import.meta.env.VITE_API_URL+'/category', {
        credentials: "include"
      })).json()
      console.log(data)
      setCategories(data.data.filter(e=>e.id!==1).map((e)=>{
        let checked = false
        if(categoriesIds){
          if(categoriesIds.includes(e.id)){
            checked = true
            setOption("personalizado")
          }
        }
        return {
          id: e.id,
          label: e.name,
          checked: checked
        }
      }))
    } catch (e) {
      console.error(e)
    }
  }

  function handleSubmit(){
    const tempCategoriesIds = categories.filter(e=>e.checked).map(e=>e.id)
    if(tempCategoriesIds.length===0 || option === "todos"){
      setCategoryIds(false)
      setShowing(false)
      return
    }
    setCategoryIds(tempCategoriesIds)
    setShowing(false)
    return
  }

  useEffect(()=>{
    fetchCategories()
  },[])

  const toggleCategory = (id) => {
    setCategories(categories.map(opt => 
      opt.id === id ? { ...opt, checked: !opt.checked } : opt
    ));
  };
  

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.selectWrapper}>
            <select className={styles.select} value={option} onChange={(e)=>setOption(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>
          <button className={styles.closeBtn} aria-label="Fechar" onClick={()=>setShowing(false)}>X</button>
        </div>
        <div className={styles.grid}>
          <label className={`${styles.checkboxLabel} ${styles.disabled}`}>
            <input
              type="checkbox"
              checked={true}
              className={styles.checkbox}
              disabled={true}
            />
            <span className={styles.labelText}>Geral</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className={`${styles.checkboxLabel} ${option==="todos"?styles.disabled:""}`}>
              <input
                type="checkbox"
                checked={category.checked}
                onChange={() => toggleCategory(category.id)}
                className={styles.checkbox}
                disabled={option==="todos"}
              />
              <span className={styles.labelText}>{category.label}</span>
            </label>
          ))}
        </div>
        <div className={styles.footer}>
          <button className={styles.doneBtn} onClick={handleSubmit}>
            Concluido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Category;