import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import supabase from '../../lib/supabaseClient';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoClose, IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';

export default function ModalLogin({
  isOpen,
  onClose,
  onOpenCadastro,
  email,
  handleEmailChange,
  clearEmail,
  showPassword,
  toggleShowPassword,
  onForgotPasswordClick,
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      window.alert("Login realizado com sucesso!", data);
      onClose();
      // Redirecione o usuário para a página inicial após o login
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error("Erro ao logar com o Google", error);
    }
  };

  const handleGitHubLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.error("Erro ao logar com o Github", error);
    }
  };

  return (
    <section className={styles.modalOverlay}>
      <nav className={styles.headerModal}>
        <h1 onClick={handleHomeClick}>Cineminha</h1>
        <span onClick={handleCadastroClick}>Cadastre-se agora</span>
      </nav>

      <section className={styles.modalWrap}>
        <section className={styles.modalHeading}>
          <h2>Entrar</h2>
          <p>Digite o endereço de e-mail e a senha da sua conta Cineminha.</p>
        </section>

        <section className={styles.modalContent}>
          <span className={styles.closeButton}>
            <IoIosCloseCircleOutline onClick={onClose} />
          </span>

          {error && 
            <p className={styles.error}>
              <HiOutlineExclamationCircle />
              O endereço de e-mail ou a senha não estão corretos.
            </p>
          }

          <form className={styles.form} onSubmit={handleLogin}>
            <label className={styles.label}>Email</label>
            <section className={styles.inputWrapper}>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="seuemail@exemplo.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {showPassword ? (
                <LuEyeClosed className={styles.eyeIcon} onClick={toggleShowPassword} />
              ) : (
                <LuEye className={styles.eyeIcon} onClick={toggleShowPassword} />
              )}
            </section>
            
            <p className={styles.forgot} onClick={onForgotPasswordClick}>Esqueceu a senha?</p>

            <button className={styles.button} type="submit">Entrar</button>
            <span className={styles.spanOr}>Ou</span>
            <section className={styles.socialLogin}>
              <button type="button" className={styles.googleButton} onClick={handleGoogleLogin}>
                <FcGoogle className={styles.socialIcon} />
                Continue com Google
              </button>
              <button type="button" className={styles.githubButton} onClick={handleGitHubLogin}>
                <IoLogoGithub className={styles.socialIcon} />
                Continue com GitHub
              </button>
            </section>
          </form>
        </section>
      </section>
    </section>
  );
}