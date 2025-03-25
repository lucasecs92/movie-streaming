import styles from "../styles/Modal.module.scss";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <section className={styles.modalOverlay}>
      <section className={styles.modalHeading}>
        <h2>Entrar</h2>
        <p>Digite o endereço de e-mail e a senha da sua conta Cineminha.</p>
      </section>
      <section className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        {children}
      </section>
    </section>
  );
}