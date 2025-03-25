import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function ModalLogin({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <section className={styles.modalOverlay}>
      <section className={styles.modalHeading}>
        <h2>Entrar</h2>
        <p>Digite o endereço de e-mail e a senha da sua conta Cineminha.</p>
      </section>
      <section className={styles.modalContent}>
        <span className={styles.closeButton} >
            <IoIosCloseCircleOutline onClick={onClose}/>
        </span>
        {children}
      </section>
    </section>
  );
}