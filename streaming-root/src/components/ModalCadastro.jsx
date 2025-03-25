import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function ModalCadastro({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <section className={styles.modalOverlay}>
      <section className={styles.modalHeading}>
        <h2>Novo Usuário</h2>
        <p>Tenha acesso a sua conta em segundos.</p>
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