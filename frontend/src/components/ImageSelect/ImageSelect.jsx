import { useState, useEffect } from "react";
import styles from "./ImageSelect.module.css"; // opcional

export function ImageSelect({ images, value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = images.find(img => img.id === JSON.parse(value).id);

  return (
    <div className={styles.wrapper}>
      <div className={styles.selected} onClick={() => setOpen(!open)}>
        <img
          src={`${import.meta.env.VITE_URL}/${selected?.imgName}.png`}
          className={styles.avatar}
          alt=""
        />
        <span>{selected?.imgName}</span>
      </div>

      {open && (
        <ul className={styles.list}>
          {images.map((e) => (
            <li
              key={e.id}
              className={styles.item}
              onClick={() => {
                onChange({id: e.id, imgName: e.imgName});
                setOpen(false);
              }}
            >
              <img
                src={`${import.meta.env.VITE_URL}/${e.imgName}.png`}
                className={styles.avatar}
                alt=""
              />
              {e.imgName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
