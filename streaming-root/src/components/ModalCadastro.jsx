"use client";

import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoClose, IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import supabase from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext';

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
  const router = useRouter();
  const { setIsLoading, isLoading: isGlobalLoading } = useLoading();

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

    setIsLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('pwned password')) {
          setError("Essa senha é muito comum ou já foi exposta em um vazamento de dados. Por favor, escolha uma senha mais segura.");
        } else {
          // Para outros erros, você pode continuar mostrando a mensagem padrão ou mapeá-los também
          setError(signUpError.message);
        }
      } else {
        // Sucesso!
        onClose();
        alert("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.");
        router.push('/');
      }
    } catch (catchError) {
      console.error("Cadastro catch error:", catchError);
      setError("Ocorreu um erro inesperado durante o cadastro.");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (oauthError) {
        console.error("Erro ao cadastrar com o Google", oauthError);
        setError("Erro ao cadastrar com o Google: " + oauthError.message);
        setIsLoading(false);
      }
    } catch (catchError) {
      console.error("Google signup catch error:", catchError);
      setError("Ocorreu um erro inesperado com o cadastro via Google.");
      setIsLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    setIsLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
        // Isso garante que ele volte para a URL onde o usuário está agora
        // (localhost em dev, ou seu domínio em produção)
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (oauthError) throw oauthError;
    } catch (catchError) {
      console.error("GitHub signup error:", catchError);
      setError("Erro ao autenticar com GitHub: " + catchError.message);
      setIsLoading(false);
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
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isGlobalLoading}
              />
            </section>
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
            <button className={styles.button} type="submit" disabled={isGlobalLoading}>
              {isGlobalLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
            <span className={styles.spanOr}>Ou</span>
            <section className={styles.socialLogin}>
              <button type="button" className={styles.googleButton} onClick={handleGoogleSignUp} disabled={isGlobalLoading}>
                <FcGoogle className={styles.socialIcon} />
                Cadastrar com Google
              </button>
              <button type="button" className={styles.githubButton} onClick={handleGitHubSignUp} disabled={isGlobalLoading}>
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