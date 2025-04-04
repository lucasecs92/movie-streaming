"use client";

import styles from "../styles/Main.module.scss";
import { useCallback, useEffect, useState } from "react";
import { filmes, filmes2 } from "../data/filmes";
import { shows } from "../data/shows";
import Player from "./Player";
import MovieList from "./MovieList";
import ShowsList from "./ShowsList";
import ShowDetails from "./ShowDetails";

export default function Main({ showBanner, filmeSelecionado, setFilmeSelecionado, voltarParaLista, setShowHeaderFooter, isSeries }) {
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const handleClick = useCallback((item) => {
    setFilmeSelecionado(item);
    setShowHeaderFooter(false);
  }, [setFilmeSelecionado, setShowHeaderFooter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 795) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(4);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className={styles.main}>
      {filmeSelecionado ? (
        filmeSelecionado.temporadas ? ( // Verifica se é um show
          <ShowDetails
            show={filmeSelecionado}
            voltarParaLista={voltarParaLista}
            toggleBanner={setShowHeaderFooter}
            setIsSeries={setShowHeaderFooter}
            setShowBanner={setShowHeaderFooter}
            filmeSelecionado={filmeSelecionado}
          />
        ) : (
          <Player filmeSelecionado={filmeSelecionado} voltarParaLista={voltarParaLista} />
        )
      ) : (
        <>
          {showBanner ? (
            <section className={styles.homeContainer}>
              <section className={styles.banner}>
                <h2>Bem-vindo(a) ao Cineminha!</h2>
                <p>Assista aos melhores filmes e séries aqui.</p>
              </section>
            </section>
          ) : isSeries ? (
            <ShowsList
              shows={shows}
              slidesPerView={slidesPerView}
              transitionEnabled={transitionEnabled}
              handleClick={handleClick}
            />
          ) : (
            <MovieList
              filmes={filmes}
              filmes2={filmes2}
              currentIndex={currentIndex}
              slidesPerView={slidesPerView}
              transitionEnabled={transitionEnabled}
              nextSlide={() => setCurrentIndex((prev) => (prev + slidesPerView) % filmes.length)}
              prevSlide={() => setCurrentIndex((prev) => (prev - slidesPerView + filmes.length) % filmes.length)}
              handleClick={handleClick}
            />
          )}
        </>
      )}
    </main>
  );
}