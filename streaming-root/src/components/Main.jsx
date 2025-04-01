"use client";

import styles from "../styles/Main.module.scss";
import { useCallback, useEffect, useState } from "react";
import { filmes } from "../data/filmes";
import Player from "./Player";
import MovieList from "./MovieList";

export default function Main({ showBanner, filmeSelecionado, setFilmeSelecionado, voltarParaLista, setShowHeaderFooter }) {
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const handleClick = useCallback((filme) => {
    setFilmeSelecionado(filme);
    setShowHeaderFooter(false); // Ocultar Header e Footer ao selecionar um filme
  }, [setFilmeSelecionado, setShowHeaderFooter]);

  const nextSlide = useCallback(() => {
    setTransitionEnabled(true);
    setCurrentIndex((prevIndex) => (prevIndex + slidesPerView) % filmes.length);
  }, [slidesPerView, filmes.length]);

  const prevSlide = useCallback(() => {
    setTransitionEnabled(true);
    setCurrentIndex((prevIndex) => (prevIndex - slidesPerView + filmes.length) % filmes.length);
  }, [slidesPerView, filmes.length]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 795) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(4);
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize();
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className={styles.main}>
      {filmeSelecionado ? (
        <Player 
          filmeSelecionado={filmeSelecionado} 
          voltarParaLista={voltarParaLista} 
        />
      ) : (
        <>
          {showBanner ? (
            <section className={styles.homeContainer}>
              <section className={styles.banner}>
                <h2>Bem-vindo(a) ao Cineminha!</h2>
                <p>Assista aos melhores filmes e séries aqui.</p>
              </section>
            </section>
          ) : (
            <MovieList 
              filmes={filmes}
              currentIndex={currentIndex}
              slidesPerView={slidesPerView}
              transitionEnabled={transitionEnabled}
              nextSlide={nextSlide}
              prevSlide={prevSlide}
              handleClick={handleClick}
            />
          )}
        </>
      )}
    </main>
  );
}