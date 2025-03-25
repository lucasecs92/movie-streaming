"use client";

import styles from "../styles/page.module.scss";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import ModalLogin from "../components/ModalLogin";
import ModalCadastro from "@/components/ModalCadastro";
import { useState, useCallback } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { IoClose } from "react-icons/io5"; // Importe o ícone IoClose

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState(""); // Estado para controlar o valor do campo de email

  const toggleBanner = useCallback((shouldShowBanner) => {
    setShowBanner(shouldShowBanner);
  }, []);

  const voltarParaLista = useCallback(() => {
    setFilmeSelecionado(null);
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openCadastroModal = () => {
    setIsCadastroModalOpen(true);
  };

  const closeCadastroModal = () => {
    setIsCadastroModalOpen(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const clearEmail = () => {
    setEmail("");
  };

  return (
    <section className={styles.containerPage}>
      <Header
        onFilmesClick={(shouldShow) => {
          toggleBanner(shouldShow);
          if (filmeSelecionado) voltarParaLista();
        }}
        onLoginClick={openLoginModal}
        onCadastroClick={openCadastroModal}
      />
      <Main
        showBanner={showBanner}
        filmeSelecionado={filmeSelecionado}
        setFilmeSelecionado={setFilmeSelecionado}
        voltarParaLista={voltarParaLista}
      />
      <Footer />
      <ModalLogin isOpen={isLoginModalOpen} onClose={closeLoginModal} onOpenCadastro={openCadastroModal}>
        {/* <h2 className={styles.heading}>Entrar</h2> */}
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
          <section className={styles.rememberMe}>
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Lembrar senha</label>
          </section>
          <button className={styles.button} type="submit">Entrar</button>
          <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>
        </form>
      </ModalLogin>
      <ModalCadastro isOpen={isCadastroModalOpen} onClose={closeCadastroModal} onOpenLogin={openLoginModal}>
        {/* <h2>Cadastro</h2> */}
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
          <label className={styles.label}>Confirme a Senha</label>
          <section className={styles.passwordWrapper}>
            <input className={styles.input} type={showConfirmPassword ? "text" : "password"} required />
            {showConfirmPassword ? (
              <LuEyeClosed className={styles.eyeIcon} onClick={toggleShowConfirmPassword} />
            ) : (
              <LuEye className={styles.eyeIcon} onClick={toggleShowConfirmPassword} />
            )}
          </section>
          <button className={styles.button} type="submit">Cadastrar</button>
        </form>
      </ModalCadastro>
    </section>
  );
}