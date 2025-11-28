

import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

export default function Tooltip({ text, children, offset = -12 }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMove = (e) => {
    setPos({
      x: e.clientX + offset,
      y: e.clientY + offset,
    });
  };

  const child = children({
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onMouseMove: handleMove,
  });

  // calcula posição com clamp simples para não sair da viewport
  const renderTooltip = () => {
    if (!visible) return null;

    // Proteção: se window não existir (SSR), não renderiza
    if (typeof window === "undefined") return null;

    const pad = 8; // espaço mínimo na borda
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = pos.x;
    let top = pos.y;

    // evita sair da tela (leva em conta translate(-50%,-50%))
    // aqui assumimos largura/altura aproximadas; para perfeição medir com ref
    const approxWidth = 140; 
    const approxHeight = 36;

    if (left - approxWidth/2 < pad) left = pad + approxWidth/2;
    if (left + approxWidth/2 > vw - pad) left = vw - pad - approxWidth/2;
    if (top - approxHeight/2 < pad) top = pad + approxHeight/2;
    if (top + approxHeight/2 > vh - pad) top = vh - pad - approxHeight/2;

    const style = {
      left: `${left}px`,
      top: `${top}px`,
    };

    return createPortal(
      <div className={styles.tooltip} style={style}>
        {text}
      </div>,
      document.body
    );
  };

  return (
    <>
      {child}
      {renderTooltip()}
    </>
  );
}
