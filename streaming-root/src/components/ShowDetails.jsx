"use client";

import styles from "../styles/ShowDetails.module.scss";
import { useState, useEffect } from "react";
import Player from "./Player";
import { useLoading } from '../contexts/LoadingContext';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const LOADER_DURATION = 250; // milliseconds

const ShowDetails = ({
  show,
  voltarParaLista,
  setShowHeaderFooter,
}) => {
  const [episodioSelecionado, setEpisodioSelecionado] = useState(null);
  const [temporadaSelecionada, setTemporadaSelecionada] = useState(null);
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

  const voltarParaDetalhes = () => {
    setIsLoading(true);
    setEpisodioSelecionado(null);
    setShowHeaderFooter(true);
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  };

  const handleEpisodioClick = (episodio) => {
    setIsLoading(true);
    setEpisodioSelecionado(episodio);
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  };

  useEffect(() => {
    if (episodioSelecionado) {
      setShowHeaderFooter(false);
    } else {
      setShowHeaderFooter(true);
    }
  }, [episodioSelecionado, setShowHeaderFooter]);

  useEffect(() => {
    if (show && show.temporadas && show.temporadas.length > 0 && !temporadaSelecionada) {
      setTemporadaSelecionada(show.temporadas[0]);
    }
  }, [show, temporadaSelecionada]);

  const toggleSynopsis = () => {
    setShowSynopsisText(prevState => !prevState);
  };

  return (
    <section className={styles.showDetailsPageContainer}>
      {episodioSelecionado ? (
        <Player
          filmeSelecionado={{
            titulo: `${show.titulo} - ${temporadaSelecionada?.nome || ''} - ${episodioSelecionado.nome}`,
            iframeSrc: episodioSelecionado.iframeSrc,
          }}
          voltarParaLista={voltarParaDetalhes}
        />
      ) : (
        <section className={styles.showDetailsContainer}>
          <section className={styles.showDetailsWrapper}>
            <img src={show.capa} alt={`Capa de ${show.titulo}`} className={styles.capa} />
            <section className={styles.description}>
              <section className={styles.descriptionWrapper}>
                <h2>{show.titulo}</h2>
                <p>{show.ano}</p>
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
                    <p className={styles.sinopse}>{show.sinopse || "Sinopse não disponível."}</p>
                  )}
                </>
              ) : (
                <p className={styles.sinopse}>{show.sinopse || "Sinopse não disponível."}</p>
              )}
            </section>
          </section>
          <section className={styles.temporadas}>
            {show.temporadas && show.temporadas.length > 0 ? (
              <>
                <select
                  onChange={(e) => {
                    const selectedIndex = parseInt(e.target.value, 10);
                    if (!isNaN(selectedIndex) && show.temporadas[selectedIndex]) {
                      setTemporadaSelecionada(show.temporadas[selectedIndex]);
                    }
                  }}
                  value={show.temporadas.findIndex(t => t === temporadaSelecionada) ?? ""}
                  className={styles.temporadaSelect}
                >
                  <option value="" disabled={temporadaSelecionada !== null}>
                    Selecione uma temporada
                  </option>
                  {show.temporadas.map((temporada, index) => (
                    <option key={index} value={index}>
                      {temporada.nome}
                    </option>
                  ))}
                </select>
                {temporadaSelecionada && (
                  <ul className={styles.episodiosLista}>
                    {temporadaSelecionada.episodios.map((episodio, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleEpisodioClick(episodio)}
                        className={styles.episodio}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleEpisodioClick(episodio);
                          }
                        }}
                      >
                        <strong>{episodio.nome}</strong>: {episodio.descricao}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p>Informações de temporadas não disponíveis.</p>
            )}
          </section>
        </section>
      )}
    </section>
  );
};

export default ShowDetails;