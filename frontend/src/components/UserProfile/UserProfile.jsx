import styles from "./UserProfile.module.css";
import StyleSquare from "../StyleSquare/StyleSquare";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/authContext";
import BackButton from "../../components/BackButton/BackButton";
import { useNavigate } from "react-router-dom";
import useWindowWidth from "../../hooks/useWindowWidth";


export default function UserProfile() {
  const window = useWindowWidth()
  const [data, setData] = useState({});
  const { user } = useAuth({});
  const [graphData, setGraphData] = useState([])
  const navigate = useNavigate()
  const [waiting, setWaiting] = useState(false);
  console.log(user)
  const graphRef = useRef(null)

  async function fetchData() {
    try {
      const data = await fetch(
        import.meta.env.VITE_API_URL + "/user/me/points",
        {
          credentials: "include",
        }
      );
      // console.log((await data.json()).data)
      setData((await data.json()).data);
    } catch (e) {
      console.error(e);
    }
  }
  async function fetchGraphData() {
    try {
      const data = await fetch(
        import.meta.env.VITE_API_URL + "/world/my-progress",
        {
          credentials: "include",
        }
      );
      // console.log((await data.json()).data)
      setGraphData((await data.json()).data);
    } catch (e) {
      console.error(e);
    }
  }
  function logout(event) {
    event.preventDefault();
    setWaiting(true);
    fetch(import.meta.env.VITE_API_URL + "/login/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        // const data = await response.json();
        window.location.href = import.meta.env.VITE_URL;
      })
      .catch(() => {
        setWaiting(false);
      });
  }

  useEffect(() => {
    fetchData();
    fetchGraphData()
  }, []);

  useEffect(()=>{
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const newData = [...graphData]
      console.log(newData.map((e,i)=>{
            const newE = [...e]
            if(i==0){
              newE.push({role: "style"})
              return newE
            }
            newE.push(i%2?'var(--primary)':'var(--balck)')
            return newE
          }))
      
        const data = google.visualization.arrayToDataTable([
          ...(newData.map((e,i)=>{
            const newE = [...e]
            if(i==0){
              newE.push({role: "style"})
              return newE
            }
            newE.push(i%2?'#F03828':'#070707')
            return newE
          }))
        ]);


        const options = {
          title: "Progresso total em mundos distintos",
          titleTextStyle: {
            fontSize: 24*innerWidth/1920
          },
          legend: {
            position: 'bottom'
          },
          backgroundColor: 'transparent',
          colors: ['#F03828'],
          hAxis: {
            format: '#\'%\'',
            minValue: 0,
            maxValue:100
          }
        };
        const chart = new google.visualization.BarChart(graphRef.current);
        chart.draw(data, options);
    }
    
  }, [graphData, window])
  return (
    <div className={styles.box}>
      <div ref={graphRef} className={styles.graph}>

      </div>
      <div className={styles.card}>
        <div className={styles.avatarWrapper}>
          <img
            src={import.meta.env.VITE_URL + "/" + user.imgName + ".png"}
            alt="Foto de Perfil"
            className={styles.avatar}
          />
        </div>

        <h2 className={styles.name}>{user.username}</h2>
        {/* <p className={styles.username}>@usuario</p> */}

        <div className={styles.stats}>
          <div>
            <p className={styles.puncctuation}>
              {data.points === undefined ? "..." : data.points}
            </p>
            <span className={styles.span}>Pontos</span>
          </div>
        </div>

        {/* <button className={styles.editButton}>Editar Perfil</button> */}
        <button
          className={styles.editButton}
          onClick={() =>
            navigate("/edit-profile")
          }
          disabled={waiting}
        >
          Editar Perfil
        </button>
        {
          user.admin && <button
          className={styles.editButton}
          onClick={()=>navigate('/admin')}
          disabled={waiting}
        >
          Admin
        </button>
        }
        <button
          className={styles.editButton + ' ' + styles.logout}
          onClick={logout}
          disabled={waiting}
        >
          Sair
        </button>
      </div>
      <StyleSquare
        option={2}
        innerColor={"var(--gray)"}
        outColor={"var(--black)"}
        position={"bottomRight"}
      ></StyleSquare>
      <BackButton onClick={()=>navigate('/')}></BackButton>
    </div>
  );
}
