"use client";

import { useState, useRef } from "react";
import styles from "../styles/MovieList.module.scss";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

const MovieList = ({ filmes, filmes2, slidesPerView, transitionEnabled, handleClick }) => {
  const [currentIndex1, setCurrentIndex1] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const isDragging = useRef(false);

  const nextSlide = (setCurrentIndex) => {
    setCurrentIndex((prevIndex) => (prevIndex + slidesPerView) % filmes.length);
  };

  const prevSlide = (setCurrentIndex) => {
    setCurrentIndex((prevIndex) => (prevIndex - slidesPerView + filmes.length) % filmes.length);
  };

  const handleMouseDown = (event) => {
    startX.current = event.pageX;
    isDragging.current = true;
  };

  const handleMouseMove = (event, setCurrentIndex, currentIndex) => {
    if (isDragging.current) {
      const currentPosition = event.pageX;
      const movedBy = currentPosition - startX.current;
      currentTranslate.current = prevTranslate.current + movedBy;
      if (movedBy > 100) {
        prevSlide(setCurrentIndex, currentIndex);
        isDragging.current = false;
      } else if (movedBy < -100) {
        nextSlide(setCurrentIndex, currentIndex);
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

  return (
    <section className={styles.listaContainer}>
      <h3>Lista de Filmes</h3>
      <section
        className={styles.carouselContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={(event) => handleMouseMove(event, setCurrentIndex1, currentIndex1)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
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
                  onDragStart={handleDragStart}
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

      {/* Nova seção - Segundo carousel */}
      <section
        className={styles.carouselContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={(event) => handleMouseMove(event, setCurrentIndex2, currentIndex2)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
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
            {filmes2.map((filme) => (
              <section key={filme.id} className={styles.capaWrap}>
                <img
                  src={filme.capa}
                  alt={`Capa do ${filme.titulo}`}
                  onClick={() => handleClick(filme)}
                  onDragStart={handleDragStart}
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