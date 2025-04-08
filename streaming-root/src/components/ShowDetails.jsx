"use client";

import styles from "../styles/ShowDetails.module.scss";
import { useState, useEffect } from "react";
import Player from "./Player";

const ShowDetails = ({
  show,
  voltarParaLista,
  setShowHeaderFooter, // Adicionado para controlar Header e Footer
}) => {
  const [episodioSelecionado, setEpisodioSelecionado] = useState(null);

  const voltarParaDetalhes = () => {
    setEpisodioSelecionado(null);
    setShowHeaderFooter(true); // Mostrar Header e Footer ao voltar
  };

  useEffect(() => {
    if (episodioSelecionado) {
      setShowHeaderFooter(false); // Ocultar Header e Footer ao exibir o Player
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
              show.temporadas.map((temporada, index) => (
                <section key={index} className={styles.temporada}>
                  <h4>{temporada.nome}</h4>
                  <ul>
                    {temporada.episodios.map((episodio, idx) => (
                      <li
                        key={idx}
                        onClick={() => setEpisodioSelecionado(episodio)}
                        className={styles.episodio}
                      >
                        <strong>{episodio.nome}</strong>: {episodio.descricao}
                      </li>
                    ))}
                  </ul>
                </section>
              ))
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