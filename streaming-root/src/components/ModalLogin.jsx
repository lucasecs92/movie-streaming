import { useEffect } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function ModalLogin({ isOpen, onClose, onOpenCadastro, children }) {
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

  const handleCadastroClick = () => {
    onClose(); // Feche o modal de login
    onOpenCadastro(); // Abra o modal de cadastro
  };

  return (
    <section className={styles.modalOverlay}>
      <nav className={styles.headerModal}>
        <h1 onClick={handleHomeClick}>Cineminha</h1>
        <span onClick={handleCadastroClick}>Cadastre-se agora</span>
      </nav>
      <section className={styles.modalHeading}>
        <h2>Entrar</h2>
        <p>Digite o endereço de e-mail e a senha da sua conta Cineminha.</p>
      </section>
      <section className={styles.modalContent}>
        <span className={styles.closeButton}>
          <IoIosCloseCircleOutline onClick={onClose} />
        </span>
        {children}
      </section>
    </section>
  );
}