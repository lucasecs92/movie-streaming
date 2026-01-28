"use client";
import styles from "../styles/ModalTexto.module.scss";

export default function ModalTexto({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <section className={styles.overlay} onClick={onClose}>
      <section className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <section className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeBtn}>&times;</button>
        </section>
        <section className={styles.content}>
          {children}
        </section>
        <section className={styles.footer}>
          <button onClick={onClose} className={styles.acceptBtn}>Fechar</button>
        </section>
      </section>
    </section>
  );
}