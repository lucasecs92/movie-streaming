import { useEffect } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function ModalCadastro({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    } else {
      window.removeEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleHomeClick = () => {
    onClose(); // Feche o modal de login
  };

  return (
    <section className={styles.modalOverlay}>
      <nav className={styles.headerModal}>
        <h1 onClick={handleHomeClick}>Cineminha</h1>
      </nav>
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