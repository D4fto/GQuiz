import styles from './GeneralRank.module.css'

const data = [
  {
    name: 'Ronaldo',
    points: 5504,
    imgUrl: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg'
  },
  {
    name: 'Max JR',
    points: 4675,
    imgUrl: 'https://ufsb.edu.br/residenciapedagogica/images/phocagallery/galeria2/thumbs/phoca_thumb_l_image03_grd.png'
  },
  {
    name: 'Andreia',
    points: 1245,
    imgUrl: 'https://t.ctcdn.com.br/JlHwiRHyv0mTD7GfRkIlgO6eQX8=/640x360/smart/i257652.jpeg'
  },
]

export default function GeneralRank(){
  return <ul>
    {data.map((x,i)=>{
      return <li key={i}>
        <img src={x.imgUrl} alt={"Imagem de " + x.name} className={styles.userImg}/>
        <span>{x.name}</span>
        <span>{x.points}pt</span>
      </li>
    })}
  </ul>
}