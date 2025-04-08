"use client";

import styles from "../styles/ShowDetails.module.scss";
import { useState, useEffect } from "react";
import Player from "./Player";

const ShowDetails = ({
  show,
  voltarParaLista,
  setShowHeaderFooter,
}) => {
  const [episodioSelecionado, setEpisodioSelecionado] = useState(null);
  const [temporadaSelecionada, setTemporadaSelecionada] = useState(null);

  const voltarParaDetalhes = () => {
    setEpisodioSelecionado(null);
    setShowHeaderFooter(true);
  };

  useEffect(() => {
    if (episodioSelecionado) {
      setShowHeaderFooter(false);
    }
  }, [episodioSelecionado, setShowHeaderFooter]);

  return (
    <section>
      {episodioSelecionado ? (
        <Player
          filmeSelecionado={{
            titulo: `${show.titulo} - ${episodioSelecionado.nome}`,
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
              <p>{show.sinopse || "Sinopse não disponível."}</p>
            </section>
          </section>
          <section className={styles.temporadas}>
            {show.temporadas ? (
              <>
                <select
                  onChange={(e) =>
                    setTemporadaSelecionada(show.temporadas[e.target.value])
                  }
                  defaultValue=""
                  className={styles.temporadaSelect}
                >
                  <option value="" disabled>
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
                        onClick={() => setEpisodioSelecionado(episodio)}
                        className={styles.episodio}
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