import { useEffect } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";

export default function ModalLogin({
  isOpen,
  onClose,
  onOpenCadastro,
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

  const handleCadastroClick = () => {
    onClose();
    onOpenCadastro();
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error with Google login:", error);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const provider = new GitHubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error with GitHub login:", error);
    }
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
        <form className={styles.form}>
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
            <input className={styles.input} type={showPassword ? "text" : "password"} required />
            {showPassword ? (
              <LuEyeClosed className={styles.eyeIcon} onClick={toggleShowPassword} />
            ) : (
              <LuEye className={styles.eyeIcon} onClick={toggleShowPassword} />
            )}
          </section>

          <section className={styles.options}>
            <section className={styles.remember}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar senha</label>
            </section>
            <a href="#" className={styles.forgot}>Esqueceu a senha?</a>
          </section>

          <button className={styles.button} type="submit">Entrar</button>

          <span className={styles.spanOr}>Ou</span>

          <section className={styles.socialLogin}>
            <button onClick={handleGoogleLogin} className={styles.googleButton}>
              <FcGoogle className={styles.socialIcon} />
              Continue com Google
            </button>
            <button onClick={handleGitHubLogin} className={styles.githubButton}>
              <IoLogoGithub className={styles.socialIcon} />
              Continue com GitHub
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}