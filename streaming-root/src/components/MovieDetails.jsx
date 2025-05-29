"use client";

import styles from "../styles/MovieDetails.module.scss";
import Player from "./Player";
import { useState, useEffect } from "react";
import { useLoading } from '../contexts/LoadingContext';
import { FaPlay } from "react-icons/fa6";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const LOADER_DURATION = 250;

const MovieDetails = ({ filme, voltarParaLista, setShowHeaderFooter }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const { setIsLoading } = useLoading();
  const [showSynopsisText, setShowSynopsisText] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const smallScreen = window.innerWidth <= 768;
      setIsSmallScreen(smallScreen);
    };

    if (typeof window !== 'undefined') {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

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

  const toggleSynopsis = () => {
    setShowSynopsisText(prevState => !prevState);
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

              {isSmallScreen ? (
                <>
                  <button
                    onClick={toggleSynopsis}
                    className={styles.sinopseButton}
                    aria-expanded={showSynopsisText}
                  >
                    SINOPSE
                    {showSynopsisText ? <FaCaretUp /> : <FaCaretDown />}
                  </button>
                  {showSynopsisText && (
                    <p className={styles.sinopse}>{filme.sinopse || "Sinopse não disponível."}</p>
                  )}
                </>
              ) : (
                <p className={styles.sinopse}>{filme.sinopse || "Sinopse não disponível."}</p>
              )}

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