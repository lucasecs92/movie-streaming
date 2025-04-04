"use client";

import { useState } from "react";
import styles from "../styles/ShowDetails.module.scss";
import Player from "./Player";
import Header from "./Header";

const ShowDetails = ({
  show,
  voltarParaLista,
  toggleBanner,
  setIsSeries,
  setShowBanner,
  filmeSelecionado,
  openLoginModal,
  openCadastroModal,
}) => {
  const [episodioSelecionado, setEpisodioSelecionado] = useState(null);

  const voltarParaDetalhes = () => {
    setEpisodioSelecionado(null);
  };

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
        <section className={styles.showDetails}>
          <Header
            onFilmesClick={(shouldShow) => {
              toggleBanner(shouldShow);
              setIsSeries(false);
              if (filmeSelecionado) voltarParaLista();
            }}
            onSeriesClick={() => {
              setShowBanner(false);
              setIsSeries(true);
              if (filmeSelecionado) voltarParaLista();
            }}
            onLoginClick={openLoginModal}
            onCadastroClick={openCadastroModal}
          />
          <button onClick={voltarParaLista} className={styles.backButton}>
            Voltar
          </button>
          <img src={show.capa} alt={`Capa de ${show.titulo}`} className={styles.capa} />
          <h2>{show.titulo}</h2>
          <p><strong>Ano:</strong> {show.ano}</p>
          <p><strong>Sinopse:</strong> {show.sinopse || "Sinopse não disponível."}</p>
          <section className={styles.temporadas}>
            <h3>Temporadas</h3>
            {show.temporadas ? (
              show.temporadas.map((temporada, index) => (
                <div key={index} className={styles.temporada}>
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
                </div>
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