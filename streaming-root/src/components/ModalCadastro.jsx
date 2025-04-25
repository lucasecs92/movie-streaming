import { useEffect } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";

export default function ModalCadastro({
  isOpen,
  onClose,
  onOpenLogin,
  email,
  handleEmailChange,
  clearEmail,
  showPassword,
  toggleShowPassword,
}) {

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleHomeClick = () => {
    onClose();
  };

  const handleLoginClick = () => {
    onClose();
    onOpenLogin();
  };

  return (
    <section className={styles.modalOverlay}>
      <nav className={styles.headerModal}>
        <h1 onClick={handleHomeClick}>Cineminha</h1>
        <span onClick={handleLoginClick}>Já é usuário?</span>
      </nav>
      <section className={styles.modalHeading}>
        <h2>Novo Usuário</h2>
        <p>Tenha acesso a sua conta em segundos.</p>
      </section>
      <section className={styles.modalContent}>
        <span className={styles.closeButton}>
          <IoIosCloseCircleOutline onClick={onClose} />
        </span>
        <form className={styles.form}>
          <label className={styles.label}>Nome</label>
          <section className={styles.inputWrapper}>
            <input className={styles.input} type="text" required />
          </section>

          <label className={styles.label}>Email</label>
          <section className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {email && (
              <IoClose className={styles.clearIcon} onClick={clearEmail} />
            )}
          </section>

          <label className={styles.label}>Senha</label>
          <section className={styles.passwordWrapper}>
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              required
            />
            {showPassword ? (
              <LuEyeClosed className={styles.eyeIcon} onClick={toggleShowPassword} />
            ) : (
              <LuEye className={styles.eyeIcon} onClick={toggleShowPassword} />
            )}
          </section>
          <button className={styles.button} type="submit">Cadastrar</button>

          <span className={styles.spanOr}>Ou</span>

          <section className={styles.socialLogin}>
            <button className={styles.googleButton}>
              <FcGoogle className={styles.socialIcon} />
              Cadastrar com Google
            </button>
            <button className={styles.githubButton}>
              <IoLogoGithub className={styles.socialIcon} />
              Cadastrar com GitHub
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}