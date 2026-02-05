"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "../styles/page.module.scss";

// Componentes
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import ModalLogin from "../components/ModalLogin";
import ModalCadastro from "@/components/ModalCadastro";
import ModalForgotPassword from "../components/ModalForgotPassword";
import ModalResetPasswordForm from "../components/ModalResetPasswordForm";
import LegalModals from "../components/LegalModals";
import LoadingOverlay from '../components/LoadingOverlay';

// Hooks e Contextos
import { LoadingProvider, useLoading } from '../contexts/LoadingContext';
import { useUiStore } from "../hooks/useUiStore";
import useModalScrollLock from "../hooks/useModalScrollLock";
import supabase from '../../lib/supabaseClient';

function HomeComponent() {
  const { modals, openModal, closeModal } = useUiStore();
  const { setIsLoading } = useLoading();

  // Estados de Conteúdo
  const [showBanner, setShowBanner] = useState(true);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  const [isSeries, setIsSeries] = useState(false);

  // Estados de Formulário
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Trava de Scroll
  const isAnyModalOpen = modals.login || modals.cadastro || modals.forgotPassword || modals.resetPassword || !!modals.legal;
  useModalScrollLock(isAnyModalOpen);

  // --- Lógica de Autenticação Supabase ---
  const handleResetPassword = async (newPassword) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert("Senha redefinida com sucesso!");
      closeModal('resetPassword');
      if (globalThis.location.hash) {
        globalThis.history.pushState("", document.title, globalThis.location.pathname + globalThis.location.search);
      }
    } catch (err) {
      alert("Erro ao redefinir: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") openModal('resetPassword');
    });
    return () => authListener?.unsubscribe();
  }, []);

  // --- Handlers de Navegação ---
  const voltarParaListaPrincipal = useCallback(() => {
    setFilmeSelecionado(null);
    setShowHeaderFooter(true);
  }, []);

  return (
    <section className={styles.containerPage}>
      {showHeaderFooter && (
        <Header
          onFilmesClick={(shouldShow) => {
            setShowBanner(shouldShow);
            setIsSeries(false);
            if (filmeSelecionado) voltarParaListaPrincipal();
          }}
          onSeriesClick={() => {
            setShowBanner(false);
            setIsSeries(true);
            if (filmeSelecionado) voltarParaListaPrincipal();
          }}
          onLoginClick={() => openModal('login')}
          onCadastroClick={() => openModal('cadastro')}
        />
      )}

      <Main
        showBanner={showBanner}
        filmeSelecionado={filmeSelecionado}
        setFilmeSelecionado={setFilmeSelecionado}
        setShowHeaderFooter={setShowHeaderFooter}
        isSeries={isSeries}
        onLoginClick={() => openModal('login')}
      />

      {showHeaderFooter && (
        <Footer
          onTermsClick={() => openModal('legal', 'terms')}
          onPrivacyClick={() => openModal('legal', 'privacy')}
        />
      )}

      {/* Modais Legais (Termos/Privacidade) */}
      <LegalModals 
        type={modals.legal} 
        isOpen={!!modals.legal} 
        onClose={() => closeModal('legal')} 
      />

      {/* Modais de Autenticação */}
      <ModalLogin
        isOpen={modals.login}
        onClose={() => closeModal('login')}
        onOpenCadastro={() => { closeModal('login'); openModal('cadastro'); }}
        email={email}
        handleEmailChange={(e) => setEmail(e.target.value)}
        clearEmail={() => setEmail("")}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
        onForgotPasswordClick={() => { closeModal('login'); openModal('forgotPassword'); }}
      />

      <ModalCadastro
        isOpen={modals.cadastro}
        onClose={() => closeModal('cadastro')}
        onOpenLogin={() => { closeModal('cadastro'); openModal('login'); }}
        email={email}
        handleEmailChange={(e) => setEmail(e.target.value)}
        clearEmail={() => setEmail("")}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
        showConfirmPassword={showConfirmPassword}
        toggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <ModalForgotPassword
        isOpen={modals.forgotPassword}
        onClose={() => closeModal('forgotPassword')}
        email={email}
        handleEmailChange={(e) => setEmail(e.target.value)}
        clearEmail={() => setEmail("")}
      />

      <ModalResetPasswordForm
        isOpen={modals.resetPassword}
        onClose={() => closeModal('resetPassword')}
        onPasswordSubmit={handleResetPassword}
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