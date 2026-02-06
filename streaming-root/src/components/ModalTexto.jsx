"use client";

import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "../styles/ModalTexto.module.scss";

export default function ModalTexto({ isOpen, onClose, title, children }) {
  const handleEsc = useCallback((e) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      globalThis.addEventListener("keydown", handleEsc);
    }
    return () => {
      globalThis.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return (
    <section className={styles.overlay}>
      <button
        type="button"
        className={styles.overlayClickArea}
        onClick={onClose}
        aria-label="Fechar modal"
      />
      <dialog open className={styles.modal} aria-labelledby="modal-title">
        <header className={styles.header}>
          <h2 id="modal-title">{title}</h2>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Fechar"
          >
            &times;
          </button>
        </header>
        
        <section className={styles.content}>
          {children}
        </section>

        <footer className={styles.footer}>
          <button 
            type="button"
            onClick={onClose} 
            className={styles.acceptBtn}
          >
            Fechar
          </button>
        </footer>
      </dialog>
    </section>
  );
}

ModalTexto.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};