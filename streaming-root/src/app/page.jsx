"use client";

import styles from "../styles/page.module.scss";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import ModalLogin from "../components/ModalLogin";
import ModalCadastro from "@/components/ModalCadastro";
import { useState, useCallback } from "react";
import useModalScrollLock from "../hooks/useModalScrollLock";

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState(""); // Estado para controlar o valor do campo de email
  const [showHeaderFooter, setShowHeaderFooter] = useState(true); // Novo estado
  const [isSeries, setIsSeries] = useState(false); // Novo estado para alternar entre filmes e séries

  useModalScrollLock(isLoginModalOpen || isCadastroModalOpen);

  const toggleBanner = useCallback((shouldShowBanner) => {
    setShowBanner(shouldShowBanner);
  }, []);

  const voltarParaLista = useCallback(() => {
    setFilmeSelecionado(null);
    setShowHeaderFooter(true); // Mostrar Header e Footer ao voltar
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
      {showHeaderFooter && (
        <Header
          onFilmesClick={(shouldShow) => {
            toggleBanner(shouldShow);
            setIsSeries(false); // Alternar para filmes
            if (filmeSelecionado) voltarParaLista();
          }}
          onSeriesClick={() => {
            setShowBanner(false); // Ocultar o banner ao clicar em séries
            setIsSeries(true); // Alternar para séries
            if (filmeSelecionado) voltarParaLista();
          }}
          onLoginClick={openLoginModal}
          onCadastroClick={openCadastroModal}
        />
      )}
      <Main
        showBanner={showBanner}
        filmeSelecionado={filmeSelecionado}
        setFilmeSelecionado={setFilmeSelecionado}
        voltarParaLista={voltarParaLista}
        setShowHeaderFooter={setShowHeaderFooter} // Passar controle de visibilidade
        isSeries={isSeries} // Passar estado para alternar entre filmes e séries
      />
      {showHeaderFooter && <Footer />}

      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onOpenCadastro={openCadastroModal}
        email={email}
        handleEmailChange={handleEmailChange}
        clearEmail={clearEmail}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />
      <ModalCadastro
        isOpen={isCadastroModalOpen}
        onClose={closeCadastroModal}
        onOpenLogin={openLoginModal}
        email={email}
        handleEmailChange={handleEmailChange}
        clearEmail={clearEmail}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
        showConfirmPassword={showConfirmPassword}
        toggleShowConfirmPassword={toggleShowConfirmPassword}
      />
    </section>
  );
}