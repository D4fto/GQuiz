import styles from './MainButton.module.css';

export default function MainButton({ text, onClick }) {
  return (
    <button className={styles.mainButton} onClick={onClick}>
      {text}
    </button>
  );
}