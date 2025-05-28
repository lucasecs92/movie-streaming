"use client";

import styles from "../styles/MovieDetails.module.scss";
import Player from "./Player";
import { useState, useEffect } from "react";
import { useLoading } from '../contexts/LoadingContext';
import { FaPlay } from "react-icons/fa6";

const LOADER_DURATION = 250;

const MovieDetails = ({ filme, voltarParaLista, setShowHeaderFooter }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (showPlayer) {
      setShowHeaderFooter(false);
    } else {
      setShowHeaderFooter(true);
    }
  }, [showPlayer, setShowHeaderFooter]);

  const handleAssistirClick = () => {
    setIsLoading(true);
    setShowPlayer(true);
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  };

  const handleVoltarParaDetalhesDoFilme = () => {
    setIsLoading(true);
    setShowPlayer(false);
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  };

  if (!filme) {
    return null;
  }

  return (
    <section className={styles.movieDetailsPageContainer}>
      {showPlayer ? (
        <Player
          filmeSelecionado={filme}
          voltarParaLista={handleVoltarParaDetalhesDoFilme}
        />
      ) : (
        <section className={styles.movieDetailsContainer}>
          <section className={styles.movieDetailsWrapper}>
            <img src={filme.capa} alt={`Capa de ${filme.titulo}`} className={styles.capa} />
            <section className={styles.descriptionMovie}>
              <section className={styles.descriptionMovieWrapper}>
                <h2>{filme.titulo}</h2>
                <p>{filme.ano}</p>
              </section>
              <p className={styles.sinopse}>{filme.sinopse || "Sinopse não disponível."}</p>
              <section className={styles.actionSection}>
                <button onClick={handleAssistirClick} className={styles.actionButton}>
                  <FaPlay />
                  ASSISTIR
                </button>
              </section>
            </section>
          </section>
        </section>
      )}
    </section>
  );
};

export default MovieDetails;