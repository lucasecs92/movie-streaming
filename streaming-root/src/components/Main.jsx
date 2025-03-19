"use client";

import styles from "../styles/Main.module.scss";
import { useCallback, useEffect, useState } from "react";
import { filmes } from "../data/filmes";
import Player from "./Player";
import MovieList from "./MovieList";

export default function Main() {
  const [filmeSelecionado, setFilmeSelecionado] = useState(null); // Estado para o filme selecionado
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para controlar o índice atual do carrossel
  const [transitionEnabled, setTransitionEnabled] = useState(true); // Estado para habilitar/desabilitar a transição

  // Função para exibir o filme selecionado
  const handleClick = useCallback((filme) => {
    setFilmeSelecionado(filme); // Define o filme selecionado
  }, []);


  // Função para voltar à lista de filmes
  const voltarParaLista = useCallback(() => {
    setFilmeSelecionado(null); // Limpa o filme selecionado
  }, []);

  // Função para avançar para o próximo conjunto de filmes
  const nextSlide = useCallback(() => {
    setTransitionEnabled(true); // Habilita a transição
    setCurrentIndex((prevIndex) => (prevIndex + slidesPerView) % filmes.length);
  }, [slidesPerView]);

  // Função para voltar ao conjunto anterior de filmes
  const prevSlide = useCallback(() => {
    setTransitionEnabled(true); // Habilita a transição
    setCurrentIndex((prevIndex) => (prevIndex - slidesPerView + filmes.length) % filmes.length);
  }, [slidesPerView]);
  
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

  return (
    <main className={styles.main}>
      {filmeSelecionado ? (
        // Exibe o player do filme se um filme estiver selecionado
        <Player 
          filmeSelecionado={filmeSelecionado} 
          voltarParaLista={voltarParaLista} 
        />
      ) : (
        // Exibe a lista de filmes se nenhum filme estiver selecionado
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
    </main>
  );
}