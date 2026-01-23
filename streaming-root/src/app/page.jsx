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
import supabase from '../../lib/supabaseClient'; 
import { LoadingProvider, useLoading } from '../contexts/LoadingContext'; 
import LoadingOverlay from '../components/LoadingOverlay';

function HomeComponent() {
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
  const { setIsLoading } = useLoading();

  useModalScrollLock(isLoginModalOpen || isCadastroModalOpen || isResetPasswordFormModalOpen);

  const openResetPasswordFormModal = useCallback(() => {
    setIsResetPasswordFormModalOpen(true);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          openResetPasswordFormModal();
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [openResetPasswordFormModal]);


  const toggleBanner = useCallback((shouldShowBanner) => {
    setShowBanner(shouldShowBanner);
  }, []);

  const voltarParaListaPrincipal = useCallback(() => {
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
    setIsLoginModalOpen(false); // Close login modal if open
    setIsForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const handleResetPassword = async (newPassword) => {
    setIsLoading(true); 
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        alert("Erro ao redefinir a senha: " + error.message);
      } else {
        alert("Senha redefinida com sucesso! Você pode fazer login com sua nova senha.");
        closeResetPasswordFormModal();
        if (globalThis.location.hash) {
          globalThis.history.pushState("", document.title, globalThis.location.pathname + globalThis.location.search);
        }
      }
    } catch (err) {
      console.error("Erro ao redefinir a senha", err);
      alert("Ocorreu um erro ao redefinir a senha.");
    } finally {
      setIsLoading(false); 
    }
  };

  const closeResetPasswordFormModal = () => {
    setIsResetPasswordFormModalOpen(false);
    // Clear the hash from the URL after closing the modal
    if (globalThis.location.hash) {
      globalThis.history.pushState("", document.title, globalThis.location.pathname + globalThis.location.search);
    }
  };


  return (
    <section className={styles.containerPage}>
      {showHeaderFooter && (
        <Header
          onFilmesClick={(shouldShow) => {
            toggleBanner(shouldShow);
            setIsSeries(false);
            if (filmeSelecionado) voltarParaListaPrincipal();
          }}
          onSeriesClick={() => {
            setShowBanner(false);
            setIsSeries(true);
            if (filmeSelecionado) voltarParaListaPrincipal();
          }}
          onLoginClick={openLoginModal}
          onCadastroClick={openCadastroModal}
        />
      )}
      <Main
        showBanner={showBanner}
        filmeSelecionado={filmeSelecionado}
        setFilmeSelecionado={setFilmeSelecionado}
        setShowHeaderFooter={setShowHeaderFooter}
        isSeries={isSeries}
        onLoginClick={openLoginModal}
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
      />
      <ModalForgotPassword
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
        email={email} 
        handleEmailChange={handleEmailChange} 
        clearEmail={clearEmail} 
      />
      <ModalResetPasswordForm
        isOpen={isResetPasswordFormModalOpen}
        onClose={closeResetPasswordFormModal}
        onPasswordSubmit={handleResetPassword}
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

export default function Home() {
  return (
    <LoadingProvider>
      <HomeComponent />
      <LoadingOverlay />
    </LoadingProvider>
  );
}