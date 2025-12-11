import { useState, useEffect } from "react";
import styles from "./EditProfile.module.css";
import { useAuth } from "../../contexts/authContext";
import StyleSquare from "../StyleSquare/StyleSquare";
import { useNavigate } from "react-router-dom";
import { ImageSelect } from "../ImageSelect/imageSelect";

export default function EditProfile() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user.username || "");
  const [selectedImg, setSelectedImg] = useState("")
  const [images, setImages] = useState([])
  const navigate = useNavigate()
  const [waiting, setWaiting] = useState(false);

  async function fetchImages() {
    const data = await (await fetch(import.meta.env.VITE_API_URL+'/user-imgs',{
      credentials: "include"
    })).json()
    data.data.map((e)=>{
      if(e.imgName==user.imgName){
        setSelectedImg(JSON.stringify({id: e.id, imgName: e.imgName}))
      }
    })
    setImages(data.data)
  } 

  async function handleSubmit(e) {
    e.preventDefault();
    setWaiting(true);


    try {
      await fetch(import.meta.env.VITE_API_URL + "/user/update", {
        method: "PUT",
        credentials: "include",
     
      });

      navigate("/profile");
    } catch (e) {
      console.error(e);
      setWaiting(false);
    }
  }

  useEffect(()=>{
    fetchImages()
  },[])

  return (
    <div className={styles.box}>
      <div className={styles.card}>

        <h1 className={styles.title}>Editar Perfil</h1>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.avatarWrapper}>
            <img
              src={
                selectedImg?
                import.meta.env.VITE_URL + "/" + JSON.parse(selectedImg).imgName + ".png":
                import.meta.env.VITE_URL + "/" + user.imgName + ".png"
              }
              alt="Avatar"
              className={styles.avatar}
            />
          </div>
          <div className={styles.editImage}>
            <label htmlFor="images">Editar imagem</label>
            <ImageSelect
              images={images}
              value={selectedImg}
              onChange={(obj)=>setSelectedImg(JSON.stringify(obj))}
              />
          </div>

          <label className={styles.label}>Nome de usuário</label>
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button className={styles.saveButton} disabled={waiting}>
            Salvar Alterações
          </button>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/profile")}
          >
            Voltar
          </button>

        </form>
        
      </div>
            <div>
            <StyleSquare
              option={2}
              innerColor={"var(--gray)"}
              outColor={"var(--black)"}
              position={"bottomRight"}
            ></StyleSquare>
          </div>
    </div>
  );
}
