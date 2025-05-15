"use client";

import styles from "../styles/MovieList.module.scss";
import { useState, useRef } from "react";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import Player from "./Player";
import { useLoading } from '../contexts/LoadingContext';

const LOADER_DURATION = 250; // milliseconds

const MovieList = ({ filmes, filmes2, slidesPerView, transitionEnabled, setShowHeaderFooter }) => {
  const [currentIndex1, setCurrentIndex1] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const isDragging = useRef(false);
  const { setIsLoading } = useLoading();

  const nextSlide = (setCurrentIndex, currentList) => {
    setCurrentIndex((prevIndex) => (prevIndex + slidesPerView) % currentList.length);
  };

  const prevSlide = (setCurrentIndex, currentList) => {
    setCurrentIndex((prevIndex) => (prevIndex - slidesPerView + currentList.length) % currentList.length);
  };

  const handleMouseDown = (event) => {
    startX.current = event.pageX;
    isDragging.current = true;
  };

  const handleMouseMove = (event, setCurrentIndex, currentList) => {
    if (isDragging.current) {
      const currentPosition = event.pageX;
      const movedBy = currentPosition - startX.current;
      currentTranslate.current = prevTranslate.current + movedBy;
      if (movedBy > 100) {
        prevSlide(setCurrentIndex, currentList);
        isDragging.current = false;
      } else if (movedBy < -100) {
        nextSlide(setCurrentIndex, currentList);
        isDragging.current = false;
      }
    }
  };

  const handleMouseUp = () => {
    prevTranslate.current = currentTranslate.current;
    isDragging.current = false;
  };

  const handleDragStart = (event) => {
    event.preventDefault();
  };

  const handleFilmeClick = (filme) => {
    setIsLoading(true);
    setFilmeSelecionado(filme);
    setShowHeaderFooter(false);
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  };

  const voltarParaLista = () => {
    setIsLoading(true);
    setFilmeSelecionado(null);
    setShowHeaderFooter(true);
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  };

  if (filmeSelecionado) {
    return (
      <Player
        filmeSelecionado={filmeSelecionado}
        voltarParaLista={voltarParaLista}
      />
    );
  }

  return (
    <section className={styles.listaContainer}>
      <h3>Lista de Filmes</h3>
      <section
        className={styles.carouselContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={(event) => handleMouseMove(event, setCurrentIndex1, filmes)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <button onClick={() => prevSlide(setCurrentIndex1, filmes)} className={styles.navButton}>
          <BsChevronLeft />
        </button>
        <section className={styles.slideFilmes}>
          <section
            className={styles.slideWrapper}
            style={{
              transform: `translateX(-${currentIndex1 * (100 / slidesPerView)}%)`,
              transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
            }}
          >
            {filmes.map((filme) => (
              <section key={filme.id} className={styles.capaWrap}>
                <img
                  src={filme.capa}
                  alt={`Capa do ${filme.titulo}`}
                  onClick={() => handleFilmeClick(filme)}
                  onDragStart={handleDragStart}
                />
                <p onClick={() => handleFilmeClick(filme)}>
                  {filme.titulo}
                  <br />
                  {filme.ano}
                </p>
              </section>
            ))}
          </section>
        </section>
        <button onClick={() => nextSlide(setCurrentIndex1, filmes)} className={styles.navButton}>
          <BsChevronRight />
        </button>
      </section>

      {/* Nova seção - Segundo carousel */}
      <section
        className={styles.carouselContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={(event) => handleMouseMove(event, setCurrentIndex2, filmes2)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <button onClick={() => prevSlide(setCurrentIndex2, filmes2)} className={styles.navButton}>
          <BsChevronLeft />
        </button>
        <section className={styles.slideFilmes}>
          <section
            className={styles.slideWrapper}
            style={{
              transform: `translateX(-${currentIndex2 * (100 / slidesPerView)}%)`,
              transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
            }}
          >
            {filmes2.map((filme) => (
              <section key={filme.id} className={styles.capaWrap}>
                <img
                  src={filme.capa}
                  alt={`Capa do ${filme.titulo}`}
                  onClick={() => handleFilmeClick(filme)}
                  onDragStart={handleDragStart}
                />
                <p onClick={() => handleFilmeClick(filme)}>
                  {filme.titulo}
                  <br />
                  {filme.ano}
                </p>
              </section>
            ))}
          </section>
        </section>
        <button onClick={() => nextSlide(setCurrentIndex2, filmes2)} className={styles.navButton}>
          <BsChevronRight />
        </button>
      </section>
    </section>
  );
};

export default MovieList;