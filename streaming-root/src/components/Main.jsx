"use client";

import styles from "../styles/Main.module.scss";
import { useCallback, useEffect, useState } from "react";
import { filmes, filmes2 } from "../data/filmes";
import { shows } from "../data/shows";
import MovieList from "./MovieList";
import ShowsList from "./ShowsList";
import ShowDetails from "./ShowDetails";

export default function Main({ showBanner, filmeSelecionado, setFilmeSelecionado, setShowHeaderFooter, isSeries }) {
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [transitionEnabled] = useState(true);

  const handleClick = useCallback((item) => {
    setFilmeSelecionado(item);
  }, [setFilmeSelecionado]);

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
        <ShowDetails
          show={filmeSelecionado}
          voltarParaLista={() => setFilmeSelecionado(null)}
          setShowHeaderFooter={setShowHeaderFooter} // Passar controle de Header e Footer
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
              slidesPerView={slidesPerView}
              transitionEnabled={transitionEnabled}
              setShowHeaderFooter={setShowHeaderFooter} // Passar controle de Header e Footer
            />
          )}
        </>
      )}
    </main>
  );
}