import NextButton from '../NextButton/NextButton'
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css'
export default function BackButton({classes, onClick = false}){
    const navigate = useNavigate();
    return(
        <NextButton
        classes={`${styles.mirror} ${classes}`} onClick={onClick?onClick:()=>navigate(-1)}/>
    );
}