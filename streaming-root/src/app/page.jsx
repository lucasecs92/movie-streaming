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
import { useRouter } from 'next/navigation'; // Importe useRouter
import supabase from '../../lib/supabaseClient'; // Importe o cliente Supabase
import { LoadingProvider, useLoading } from '../contexts/LoadingContext'; // Adjust path if necessary
import LoadingOverlay from '../components/LoadingOverlay'; // Adjust path if necessary

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
  const router = useRouter();
  const { setIsLoading } = useLoading();

  useModalScrollLock(isLoginModalOpen || isCadastroModalOpen || isResetPasswordFormModalOpen);

  const openResetPasswordFormModal = useCallback(() => {
    setIsResetPasswordFormModalOpen(true);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          // This event fires when the user clicks the password recovery link
          // and is redirected back to the app.
          // Supabase client handles the token from the URL fragment (#access_token=...).
          // Now we can show the form to enter a new password.
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
    setIsLoginModalOpen(false); // Close login modal if open
    setIsForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const handleResetPassword = async (newPassword) => {
    setIsLoading(true); // Show global loader
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        alert("Erro ao redefinir a senha: " + error.message);
      } else {
        alert("Senha redefinida com sucesso! Você pode fazer login com sua nova senha.");
        closeResetPasswordFormModal();
        if (window.location.hash) {
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        }
      }
    } catch (err) {
      console.error("Erro ao redefinir a senha", err);
      alert("Ocorreu um erro ao redefinir a senha.");
    } finally {
      setIsLoading(false); // Hide global loader
    }
  };

  const closeResetPasswordFormModal = () => {
    setIsResetPasswordFormModalOpen(false);
    // Clear the hash from the URL after closing the modal
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
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
      // Removed onResetPassword prop as it's not used in the new flow from ModalLogin
      />
      <ModalForgotPassword
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
        email={email} // Pass current email or allow it to manage its own
        handleEmailChange={handleEmailChange} // Or let it manage its own state
        clearEmail={clearEmail} // Or let it manage its own state
      // Removed onResetPassword prop, it now only sends the email and closes.
      />
      <ModalResetPasswordForm
        isOpen={isResetPasswordFormModalOpen}
        onClose={closeResetPasswordFormModal}
        onPasswordSubmit={handleResetPassword}
      // Token is handled by Supabase client, no need to pass as prop
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
      <LoadingOverlay /> {/* Render LoadingOverlay here, it will be controlled by context */}
    </LoadingProvider>
  );
}