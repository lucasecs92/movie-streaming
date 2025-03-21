"use client";

import { useState } from "react";
import styles from "../styles/MovieList.module.scss";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

const MovieList = ({ filmes, slidesPerView, transitionEnabled, handleClick }) => {
  const [currentIndex1, setCurrentIndex1] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);

  const nextSlide = (setCurrentIndex, currentIndex) => {
    setCurrentIndex((prevIndex) => (prevIndex + slidesPerView) % filmes.length);
  };

  const prevSlide = (setCurrentIndex, currentIndex) => {
    setCurrentIndex((prevIndex) => (prevIndex - slidesPerView + filmes.length) % filmes.length);
  };

  return (
    <section className={styles.listaContainer}>
      <h3>Lista de Filmes</h3>
      <section className={styles.carouselContainer}>
        <button onClick={() => prevSlide(setCurrentIndex1, currentIndex1)} className={styles.navButton}>
          <BsChevronLeft />
        </button>
        <section className={styles.slideFilmes}>
          <section
            className={styles.slideWrapper}
            style={{
              transform: `translateX(-${currentIndex1 * (100 / slidesPerView)}%)`,
              transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none'
            }}
          >
            {filmes.map((filme) => (
              <section key={filme.id} className={styles.capaWrap}>
                <img
                  src={filme.capa}
                  alt={`Capa do ${filme.titulo}`}
                  onClick={() => handleClick(filme)}
                />
                <p onClick={() => handleClick(filme)}>
                  {filme.titulo}
                  <br />
                  {filme.ano}
                </p>
              </section>
            ))}
          </section>
        </section>
        <button onClick={() => nextSlide(setCurrentIndex1, currentIndex1)} className={styles.navButton}>
          <BsChevronRight />
        </button>
      </section>

      {/* Nova seção de carouselContainer */}
      <section className={styles.carouselContainer}>
        <button onClick={() => prevSlide(setCurrentIndex2, currentIndex2)} className={styles.navButton}>
          <BsChevronLeft />
        </button>
        <section className={styles.slideFilmes}>
          <section
            className={styles.slideWrapper}
            style={{
              transform: `translateX(-${currentIndex2 * (100 / slidesPerView)}%)`,
              transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none'
            }}
          >
            {filmes.map((filme) => (
              <section key={filme.id} className={styles.capaWrap}>
                <img
                  src={filme.capa}
                  alt={`Capa do ${filme.titulo}`}
                  onClick={() => handleClick(filme)}
                />
                <p onClick={() => handleClick(filme)}>
                  {filme.titulo}
                  <br />
                  {filme.ano}
                </p>
              </section>
            ))}
          </section>
        </section>
        <button onClick={() => nextSlide(setCurrentIndex2, currentIndex2)} className={styles.navButton}>
          <BsChevronRight />
        </button>
      </section>
    </section>
  );
};

export default MovieList;