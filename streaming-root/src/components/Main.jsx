"use client";

import styles from "../styles/Main.module.scss";
import { useEffect, useState } from "react";
import { filmes } from "../data/filmes";

export default function Main() {
  const [filmeSelecionado, setFilmeSelecionado] = useState(null); // Estado para o filme selecionado
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para controlar o índice atual do carrossel
  const [transitionEnabled, setTransitionEnabled] = useState(true); // Estado para habilitar/desabilitar a transição

  // Função para exibir o filme selecionado
  const handleClick = (filme) => {
    setFilmeSelecionado(filme); // Define o filme selecionado
  };

  // Função para voltar à lista de filmes
  const voltarParaLista = () => {
    setFilmeSelecionado(null); // Limpa o filme selecionado
  };

  // Função para avançar para o próximo conjunto de filmes
  const nextSlide = () => {
    setTransitionEnabled(true); // Habilita a transição
    setCurrentIndex((prevIndex) => (prevIndex + slidesPerView) % filmes.length);
  };

  // Função para voltar ao conjunto anterior de filmes
  const prevSlide = () => {
    setTransitionEnabled(true); // Habilita a transição
    setCurrentIndex((prevIndex) => (prevIndex - slidesPerView + filmes.length) % filmes.length);
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 795) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(4);
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Configura o valor inicial
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcula os filmes visíveis com base no índice atual
  const visibleFilmes = filmes.slice(currentIndex, currentIndex + slidesPerView);

  return (
    <main className={styles.main}>
      {filmeSelecionado ? (
        // Exibe o player do filme se um filme estiver selecionado
        <section className={styles.playerContainer}>
          <h2>{filmeSelecionado.titulo}</h2>
          <iframe
            className={styles.iframe}
            src={filmeSelecionado.iframeSrc}
            width="560"
            height="384"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
          ></iframe>
          <button onClick={voltarParaLista} className={styles.botaoVoltar}>
            Voltar para a lista
          </button>
        </section>
      ) : (
        // Exibe a lista de filmes se nenhum filme estiver selecionado
        <>
          <section className={styles.listaContainer}>
            <h3>Lista de Filmes</h3>
            <section className={styles.carouselContainer}>
              <button onClick={prevSlide} className={styles.navButton}>Prev</button>
              <section className={styles.slideFilmes}>
                <section className={styles.slideWrapper} style={{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`, transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none' }}>
                  {filmes.map((filme) => (
                    <section key={filme.id} className={styles.capaWrap}>
                      <img src={filme.capa} alt={`Capa do ${filme.titulo}`} onClick={() => handleClick(filme)} />
                      <p onClick={() => handleClick(filme)}>
                        {filme.titulo}
                        <br />
                        {filme.ano}
                      </p>
                    </section>
                  ))}
                </section>
              </section>
              <button onClick={nextSlide} className={styles.navButton}>Next</button>
            </section>
          </section>
        </>
      )}
    </main>
  );
}