"use client";

import styles from "../styles/MovieList.module.scss";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

const MovieList = ({
  filmes,
  currentIndex,
  slidesPerView,
  transitionEnabled,
  nextSlide,
  prevSlide,
  handleClick
}) => {
  return (
    <section className={styles.listaContainer}>
      <h3>Lista de Filmes</h3>
      <section className={styles.carouselContainer}>
        <button onClick={prevSlide} className={styles.navButton}>
          <BsChevronLeft />
        </button>
        <section className={styles.slideFilmes}>
          <section
            className={styles.slideWrapper}
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
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
        <button onClick={nextSlide} className={styles.navButton}>
          <BsChevronRight />
        </button>
      </section>
    </section>
  );
};

export default MovieList;