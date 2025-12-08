import styles from './StyleSquare.module.css'
import { useRef, useEffect } from 'react'
const stylesSquarePath = '../../assets/stylesSquares/'

import Option1 from '../../assets/stylesSquares/option1.svg?react'
import Option2 from '../../assets/stylesSquares/option2.svg?react'
import Option3 from '../../assets/stylesSquares/option3.svg?react'
import Option4 from '../../assets/stylesSquares/option4.svg?react'
import Option5 from '../../assets/stylesSquares/option5.svg?react'

const options = {
  1: Option1,
  2: Option2,
  3: Option3,
  4: Option4,
  5: Option5,
}

export default function StyleSquare({option, position, innerColor, outColor}){
  const svgRef = useRef(null)
  const SvgComponent = options[option]

  useEffect(()=>{
    if (svgRef.current) {
      const inner = svgRef.current.getElementById('innerStyleSquare');
      const outer = svgRef.current.getElementById('outStyleSquare');
      if (inner) inner.setAttribute('fill', innerColor);
      if (outer) outer.setAttribute('fill', outColor);
    }
  }, [innerColor, outColor])


  return <div className={`${styles.styleSquare} ${styles[position]}`}>
    <SvgComponent ref={svgRef}></SvgComponent>
  </div>
}