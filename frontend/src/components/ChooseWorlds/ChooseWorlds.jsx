import styles from "./ChooseWorlds.module.css";

const iconClasses = {
  Geral: (
    <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#000000">
      <path d="m389-400 91-55 91 55-24-104 80-69-105-9-42-98-42 98-105 9 80 69-24 104ZM200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
    </svg>
  ),
  Computacao: (
    <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#000000">
      <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm160-40h320v-80H320v80ZM200-440h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM200-560h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM160-280v-400 400Z"/>
    </svg>
  ),
  Matematica: (
    <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#000000">
      <path d="M400-240v-80h62l105-120-105-120h-66l-64 344q-8 45-37 70.5T221-120q-45 0-73-24t-28-64q0-32 17-51.5t43-19.5q25 0 42.5 17t17.5 41q0 5-.5 9t-1.5 9q5-1 8.5-5.5T252-221l62-339H200v-80h129l21-114q7-38 37.5-62t72.5-24q44 0 72 26t28 65q0 30-17 49.5T500-680q-25 0-42.5-17T440-739q0-5 .5-9t1.5-9q-6 2-9 6t-5 12l-17 99h189v80h-32l52 59 52-59h-32v-80h200v80h-62L673-440l105 120h62v80H640v-80h32l-52-60-52 60h32v80H400Z"/>
    </svg>
  ),
};

export default function ChooseWorlds() {
  const categorias = [
    { label: "Geral", icon: iconClasses.Geral, onClick: () => console.log("Clicou em Geral") },
    { label: "Computação", icon: iconClasses.Computacao, onClick: () => console.log("Clicou em Computacao") },
    { label: "Matemática", icon: iconClasses.Matematica, onClick: () => console.log("Clicou em Matematica") },
  ];

  return (
    <div className={styles.worldsMenu}>
      {categorias.map((cat, i) => (
        <button key={i} className={styles.worldsMenuItens} onClick={cat.onClick}>
          <div className={styles.worldsIcon}>{cat.icon}</div>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
