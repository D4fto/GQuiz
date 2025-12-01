import React, { useState } from 'react';
import styles from './Category.module.css';

const Category = () => {

  const initialOptions = Array.from({ length: 12 }, (_, index) => {
    const type = index % 3;
    return {
      id: index,
      label: type === 0 ? 'Química' : type === 1 ? 'Física' : 'Matemática',
      checked: type !== 1,
    };
  });

  const [options, setOptions] = useState(initialOptions);

  const toggleOption = (id) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, checked: !opt.checked } : opt
    ));
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.selectWrapper}>
          <select className={styles.select}>
            <option>Personalizado</option>
            <option>Padrão</option>
          </select>
        </div>
        <button className={styles.closeBtn} aria-label="Fechar">X</button>
      </div>

      <div className={styles.grid}>
        {options.map((option) => (
          <label key={option.id} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => toggleOption(option.id)}
              className={styles.checkbox}
            />
            <span className={styles.labelText}>{option.label}</span>
          </label>
        ))}
      </div>

      <div className={styles.footer}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox"/>
          <span className={styles.labelText}>Selecionar todos</span>
        </label>
        
        <button className={styles.doneBtn}>
          Concluido
        </button>
      </div>
    </div>
  );
};

export default Category;