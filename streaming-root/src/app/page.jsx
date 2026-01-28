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
import ModalTexto from "@/components/ModalTexto";

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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useModalScrollLock(isLoginModalOpen || isCadastroModalOpen || isResetPasswordFormModalOpen || isTermsModalOpen || isPrivacyModalOpen);

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
      {showHeaderFooter && (
        <Footer
          onTermsClick={() => setIsTermsModalOpen(true)}
          onPrivacyClick={() => setIsPrivacyModalOpen(true)}
        />
      )}

      {/* Modais de Termos e Privacidade */}
      <ModalTexto
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Termos de Uso"
      >
        <>
          <h3>1. Natureza do Serviço</h3>
          <p>O <strong>Cineminha</strong> atua como um <strong>indexador e curador</strong> de conteúdos audiovisuais de domínio público disponíveis em plataformas de terceiros, como YouTube e Internet Archive.</p>

          <h3>2. Propriedade Intelectual e Direitos Autorais</h3>
          <p>As obras exibidas são, conforme nossa curadoria, de <strong>domínio público</strong>. Se você for detentor de direitos autorais de qualquer obra aqui listada e acreditar que ela não deveria estar disponível, por favor, entre em contato conosco para a remoção imediata do índice.</p>

          <h3>3. Limitação de Responsabilidade (Disponibilidade)</h3>
          <p>Como o conteúdo é hospedado em servidores de terceiros (YouTube/Internet Archive), o Cineminha não garante a disponibilidade perpétua dos vídeos. Se o arquivo original for removido da plataforma de origem, ele ficará automaticamente indisponível em nosso site.</p>

          <h3>4. Uso do Site</h3>
          <p>A licença concedida é apenas para visualização pessoal. É proibido utilizar meios automatizados (bots) para extrair conteúdo ou tentar burlar as camadas de autenticação da plataforma.</p>

          <h3>5. Lei Aplicável</h3>
          <p>Estes termos são regidos pelas leis brasileiras.</p>
        </>
      </ModalTexto>

      <ModalTexto
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Política de Privacidade"
      >
        <>
          <p>A sua privacidade é importante para nós. O <strong>Cineminha</strong> preza pela transparência no tratamento dos seus dados.</p>

          <h3>1. Cadastro e Dados Pessoais</h3>
          <p>Coletamos seu e-mail apenas para criar sua conta e permitir o acesso ao catálogo. Esses dados são processados de forma segura via <strong>Supabase</strong>.</p>

          <h3>2. Cookies de Terceiros (YouTube e Internet Archive)</h3>
          <p>Nosso site utiliza a incorporação (embed) de players do <strong>YouTube</strong> e do <strong>Internet Archive</strong>. Ao reproduzir um vídeo, essas plataformas podem coletar dados como seu endereço IP e cookies de navegação para fins de estatística e personalização, conforme as políticas de privacidade de cada provedor (Google e Archive.org).</p>

          <h3>3. Segurança</h3>
          <p>Implementamos medidas de segurança para proteger suas informações de acesso. Não compartilhamos nem vendemos seus dados de cadastro a terceiros.</p>

          <p>Esta política é efetiva a partir de 28 de Janeiro de 2026.</p>
        </>
      </ModalTexto>

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