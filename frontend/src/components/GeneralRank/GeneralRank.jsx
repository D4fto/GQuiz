import styles from './GeneralRank.module.css'
import { useEffect, useState } from 'react'

// const data = [
//   {
//     name: 'Ronaldo',
//     points: 5504,
//     imgUrl: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg'
//   },
//   {
//     name: 'Max JR',
//     points: 4675,
//     imgUrl: 'https://ufsb.edu.br/residenciapedagogica/images/phocagallery/galeria2/thumbs/phoca_thumb_l_image03_grd.png'
//   },
//   {
//     name: 'Andreia',
//     points: 1245,
//     imgUrl: 'https://t.ctcdn.com.br/JlHwiRHyv0mTD7GfRkIlgO6eQX8=/640x360/smart/i257652.jpeg'
//   },
// ]

export default function GeneralRank({length=15}){
  const [data, setData] = useState([])

  async function fetchData() {
    const response = await (await fetch(import.meta.env.VITE_API_URL+'/ranking/'+length, {
      credentials: 'include'
    })).json()
    setData(response.response)

  }

  useEffect(()=>{
    fetchData()
  },[])
  return <ul>
    {data.map((x,i)=>{
      return <li key={i}>
        <img src={import.meta.env.VITE_URL+'/geral.png'} alt={"Imagem de " + x.username} className={styles.userImg}/>
        <span>{x.username}</span>
        <span>{x.points}pt</span>
      </li>
    })}
  </ul>
}