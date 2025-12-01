import NextButton from '../NextButton/NextButton'
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css'
export default function BackButton({classes}){
    const navigate = useNavigate();
    return(
        <NextButton
        classes={`${styles.mirror} ${classes}`} onClick={()=>navigate(-1)}/>
    );
}