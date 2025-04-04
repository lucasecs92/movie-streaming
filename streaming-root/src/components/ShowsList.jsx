"use client";

import { useState, useRef } from "react";
import styles from "../styles/MovieList.module.scss";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

const ShowsList = ({ shows, slidesPerView, transitionEnabled, handleClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const isDragging = useRef(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + slidesPerView) % shows.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - slidesPerView + shows.length) % shows.length);
  };

  const handleMouseDown = (event) => {
    startX.current = event.pageX;
    isDragging.current = true;
  };

  const handleMouseMove = (event) => {
    if (isDragging.current) {
      const currentPosition = event.pageX;
      const movedBy = currentPosition - startX.current;
      currentTranslate.current = prevTranslate.current + movedBy;
      if (movedBy > 100) {
        prevSlide();
        isDragging.current = false;
      } else if (movedBy < -100) {
        nextSlide();
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
      <h3>Lista de Séries</h3>
      <section
        className={styles.carouselContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <button onClick={prevSlide} className={styles.navButton}>
          <BsChevronLeft />
        </button>
        <section className={styles.slideFilmes}>
          <section
            className={styles.slideWrapper}
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
              transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
            }}
          >
            {shows.map((show) => (
              <section key={show.id} className={styles.capaWrap}>
                <img
                  src={show.capa}
                  alt={`Capa de ${show.titulo}`}
                  onClick={() => handleClick(show)}
                  onDragStart={handleDragStart}
                />
                <p onClick={() => handleClick(show)}>
                  {show.titulo}
                  <br />
                  {show.ano}
                </p>
              </section>
            ))}
          </section>
        </section>
        <button onClick={nextSlide} className={styles.navButton}>
          <BsChevronRight />
        </button>
      </section>
    </section>
  );
};

export default ShowsList;