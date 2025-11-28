import styles from "./ChooseWorlds.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ChooseWorlds() {
  const navigate = useNavigate()
  const [worlds, setWorlds]= useState([])
  const [loading, setLoading] = useState(true);

   function fetchWorlds() {
    fetch(import.meta.env.VITE_API_URL + "/world", {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return;
        }
        
        const formatted = data.data.map((world) => ({
          label: world.name,
          icon: world.icon,
          onClick: () => navigate('/worlds/'+world.id),
        }));

        setWorlds(formatted);
      })
      .catch((error) => {
        console.error("Erro ao buscar worlds:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchWorlds();
  }, []);

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.worldsMenu}>
      {worlds.map((cat, i) => (
        <button
          key={i}
          className={styles.worldsMenuItens}
          onClick={cat.onClick}
        >
          <div className={styles.worldsIcon} dangerouslySetInnerHTML={{__html:cat.icon}}></div>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  )
}