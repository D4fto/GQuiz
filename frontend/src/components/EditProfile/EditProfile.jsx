import { useState } from "react";
import styles from "./EditProfile.module.css";
import { useAuth } from "../../contexts/authContext";
import StyleSquare from "../StyleSquare/StyleSquare";

export default function EditProfile() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user.username || "");
  const [file, setFile] = useState(null);
  const [waiting, setWaiting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setWaiting(true);

    const formData = new FormData();
    formData.append("username", username);
    if (file) formData.append("image", file);

    try {
      await fetch(import.meta.env.VITE_API_URL + "/user/update", {
        method: "PUT",
        credentials: "include",
        body: formData
      });

      window.location.href = import.meta.env.VITE_URL + "/profile";
    } catch (e) {
      console.error(e);
      setWaiting(false);
    }
  }

  return (
    <div className={styles.box}>
      <div className={styles.card}>

        <h1 className={styles.title}>Editar Perfil</h1>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.avatarWrapper}>
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : import.meta.env.VITE_URL + "/" + user.imgName + ".png"
              }
              alt="Avatar"
              className={styles.avatar}
            />
          </div>

          <label className={styles.label}>Alterar foto</label>
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={(e) => setFile(e.target.files[0])}
          />

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
            onClick={() => window.location.href = import.meta.env.VITE_URL + "/profile"}
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
