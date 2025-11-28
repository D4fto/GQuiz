import NextButton from '../NextButton/NextButton'
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css'
export default function BackButton(){
    const navigate = useNavigate();
    return(
        <NextButton classes={styles.mirror} onClick={()=>navigate(-1)}/>
    );
}