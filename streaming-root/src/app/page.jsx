"use client";

import styles from "../styles/page.module.scss";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { useState, useCallback } from "react";

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);

  // Função para alternar o banner
  const toggleBanner = useCallback((shouldShowBanner) => {
    setShowBanner(shouldShowBanner);
  }, []);

  const voltarParaLista = useCallback(() => {
    setFilmeSelecionado(null);
  }, []);

  return (
    <section className={styles.containerPage}>
      <Header 
        onFilmesClick={(shouldShow) => {
          toggleBanner(shouldShow);
          if (filmeSelecionado) voltarParaLista();
        }} 
      />
      <Main 
        showBanner={showBanner} 
        filmeSelecionado={filmeSelecionado}
        setFilmeSelecionado={setFilmeSelecionado}
        voltarParaLista={voltarParaLista}
      />
      <Footer />
    </section>
  );
}