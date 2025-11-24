import styles from './MainButton.module.css';

export default function MainButton({ text, onClick, classes, options }) {
  return (
    <button className={styles.mainButton + ' ' + classes} onClick={onClick} {...options}>
      {text}
    </button>
  );
}