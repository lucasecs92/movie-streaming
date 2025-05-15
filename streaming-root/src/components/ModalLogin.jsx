"use client";

import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import supabase from '../../lib/supabaseClient';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoClose, IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext'; // Import useLoading

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
  const { setIsLoading, isLoading: isGlobalLoading } = useLoading(); // Get setIsLoading and global loading state

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

    setIsLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        // window.alert("Login realizado com sucesso!", data); // Alert can be annoying with loader
        onClose();
        router.push('/');
      }
    } catch (catchError) {
      console.error("Login catch error:", catchError);
      setError("Ocorreu um erro inesperado durante o login.");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (oauthError) {
        console.error("Erro ao logar com o Google", oauthError);
        setError("Erro ao logar com o Google: " + oauthError.message);
        setIsLoading(false); // Clear loading on pre-redirect error
      }
      // For OAuth, redirection might happen before finally. If an error occurs *before* redirection,
      // this will hide the loader. If redirection occurs, the page reloads, and loader is gone.
      // If no error and redirect happens, setIsLoading(false) might not be hit here.
    } catch (catchError) {
      console.error("Google login catch error:", catchError);
      setError("Ocorreu um erro inesperado com o login do Google.");
      setIsLoading(false);
    }
    // No finally here, as redirect might prevent it. Loader removed on error or page change.
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });

      if (oauthError) {
        console.error("Erro ao logar com o Github", oauthError);
        setError("Erro ao logar com o GitHub: " + oauthError.message);
        setIsLoading(false); // Clear loading on pre-redirect error
      }
    } catch (catchError) {
      console.error("GitHub login catch error:", catchError);
      setError("Ocorreu um erro inesperado com o login do GitHub.");
      setIsLoading(false);
    }
    // No finally here, as redirect might prevent it.
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
              {error} {/* Display the actual error message */}
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
                disabled={isGlobalLoading}
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
                disabled={isGlobalLoading}
              />
              {showPassword ? (
                <LuEyeClosed className={styles.eyeIcon} onClick={toggleShowPassword} />
              ) : (
                <LuEye className={styles.eyeIcon} onClick={toggleShowPassword} />
              )}
            </section>

            <p className={styles.forgot} onClick={isGlobalLoading ? undefined : onForgotPasswordClick}>Esqueceu a senha?</p>

            <button className={styles.button} type="submit" disabled={isGlobalLoading}>
              {isGlobalLoading ? "Entrando..." : "Entrar"}
            </button>
            <span className={styles.spanOr}>Ou</span>
            <section className={styles.socialLogin}>
              <button type="button" className={styles.googleButton} onClick={handleGoogleLogin} disabled={isGlobalLoading}>
                <FcGoogle className={styles.socialIcon} />
                Continue com Google
              </button>
              <button type="button" className={styles.githubButton} onClick={handleGitHubLogin} disabled={isGlobalLoading}>
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