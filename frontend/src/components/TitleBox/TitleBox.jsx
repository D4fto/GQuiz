import styles from './TitleBox.module.css';

export default function TitleBox({ title }) {
  return (
    <div className={styles.titleBox}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}