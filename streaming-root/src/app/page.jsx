"use client";

import styles from "../styles/page.module.scss";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import ModalLogin from "../components/ModalLogin";
import ModalCadastro from "@/components/ModalCadastro";
import { useState, useCallback, useEffect } from "react";
import useModalScrollLock from "../hooks/useModalScrollLock";
import ModalForgotPassword from "../components/ModalForgotPassword";
import ModalResetPasswordForm from "../components/ModalResetPasswordForm";
import { useSearchParams, useRouter } from 'next/navigation'; // Importe useSearchParams e useRouter
import supabase from '../../lib/supabaseClient'; // Importe o cliente Supabase

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  const [isSeries, setIsSeries] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isResetPasswordFormModalOpen, setIsResetPasswordFormModalOpen] = useState(false);
  const [resetToken, setResetToken] = useState(null); // To store a token sent to the user's email
  const [resetEmail, setResetEmail] = useState("");
  const searchParams = useSearchParams();  // Hook para acessar os parâmetros da URL
  const router = useRouter();

  useModalScrollLock(isLoginModalOpen || isCadastroModalOpen || isResetPasswordFormModalOpen);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setResetToken(urlToken);
      openResetPasswordFormModal();
    }
  }, [searchParams]);


  const toggleBanner = useCallback((shouldShowBanner) => {
    setShowBanner(shouldShowBanner);
  }, []);

  const voltarParaLista = useCallback(() => {
    setFilmeSelecionado(null);
    setShowHeaderFooter(true);
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

  const openForgotPasswordModal = () => {
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const openResetPasswordFormModal = () => {
    setIsResetPasswordFormModalOpen(true);
  };

  const closeResetPasswordFormModal = () => {
    setIsResetPasswordFormModalOpen(false);
  };

  const handleForgotPasswordSubmit = async (email) => {
    console.log("E-mail de redefinição solicitado para:", email);
    setIsForgotPasswordModalOpen(false); // Feche o ModalForgotPassword
    setEmail(email); // Defina o email
    openResetPasswordFormModal();
  };

  const handleResetPasswordRequest = (email) => {
    setResetEmail(email); // Armazena o email
    setIsForgotPasswordModalOpen(false);
    setIsResetPasswordFormModalOpen(true); // Abre o modal de redefinição
  };

  const handleResetPassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        alert("Erro ao redefinir a senha: " + error.message);
      } else {
        alert("Senha redefinida com sucesso!");
        closeResetPasswordFormModal();
        router.push('/login');
      }
    } catch (err) {
      console.error("Erro ao redefinir a senha", err);
      alert("Ocorreu um erro ao redefinir a senha.");
    }
  };

  return (
    <section className={styles.containerPage}>
      {showHeaderFooter && (
        <Header
          onFilmesClick={(shouldShow) => {
            toggleBanner(shouldShow);
            setIsSeries(false);
            if (filmeSelecionado) voltarParaLista();
          }}
          onSeriesClick={() => {
            setShowBanner(false);
            setIsSeries(true);
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
        setShowHeaderFooter={setShowHeaderFooter}
        isSeries={isSeries}
        onLoginClick={openLoginModal} // Passa a função para o botão "Começar"
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
        onForgotPasswordClick={openForgotPasswordModal}
        onResetPassword={handleForgotPasswordSubmit}
      />
      <ModalForgotPassword
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
        email={email}
        handleEmailChange={handleEmailChange}
        clearEmail={clearEmail}
        onResetPassword={handleResetPasswordRequest}
      />
      <ModalResetPasswordForm
        isOpen={isResetPasswordFormModalOpen}
        onClose={closeResetPasswordFormModal}
        onPasswordSubmit={handleResetPassword}
        //token={resetToken}
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