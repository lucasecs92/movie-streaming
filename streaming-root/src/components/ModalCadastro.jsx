import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoClose, IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import supabase from '../../lib/supabaseClient'; // Importe o cliente Supabase
import { useRouter } from 'next/navigation'; // Importe o hook useRouter do Next.js

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
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter(); // Inicialize o router

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

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !name) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      window.alert("Cadastro realizado com sucesso!", data);
      onClose();
      // Redirecione o usuário para a página inicial após o cadastro
      router.push('/');
    }
  };

  const handleGoogleSignUp = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error("Erro ao cadastrar com o Google", error);
    }
  };

  const handleGitHubSignUp = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.error("Erro ao cadastrar com o Github", error);
    }
  };

  return (
    <section className={styles.modalOverlay}>
      <nav className={styles.headerModal}>
        <h1 onClick={handleHomeClick}>Cineminha</h1>
        <span onClick={handleLoginClick}>Já é usuário?</span>
      </nav>

      <section className={styles.modalWrap}>
        <section className={styles.modalHeading}>
          <h2>Novo Usuário</h2>
          <p>Tenha acesso a sua conta em segundos.</p>
        </section>

        <section className={styles.modalContent}>
          <span className={styles.closeButton}>
            <IoIosCloseCircleOutline onClick={onClose} />
          </span>

          {error && 
            <p className={styles.error}>
              <HiOutlineExclamationCircle />
              {error}
            </p>
          }

          <form className={styles.form} onSubmit={handleCadastro}>
            <label className={styles.label}>Nome</label>
            <section className={styles.inputWrapper}>
              <input className={styles.input} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
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
            <button className={styles.button} type="submit">Cadastrar</button>
            <span className={styles.spanOr}>Ou</span>
            <section className={styles.socialLogin}>
              <button type="button" className={styles.googleButton} onClick={handleGoogleSignUp}>
                <FcGoogle className={styles.socialIcon} />
                Cadastrar com Google
              </button>
              <button type="button" className={styles.githubButton} onClick={handleGitHubSignUp}>
                <IoLogoGithub className={styles.socialIcon} />
                Cadastrar com GitHub
              </button>
            </section>
          </form>
        </section>
      </section>
    </section>
  );
}