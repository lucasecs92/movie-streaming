"use client";

import { useState } from "react"; // Adicionar useState
import styles from "../styles/Main.module.scss";
import { filmes } from "../data/filmes";

export default function Main() {
  const [filmeSelecionado, setFilmeSelecionado] = useState(null); // Estado para o filme selecionado

  // Função para exibir o filme selecionado
  const handleClick = (filme) => {
    setFilmeSelecionado(filme); // Define o filme selecionado
  };

  // Função para voltar à lista de filmes
  const voltarParaLista = () => {
    setFilmeSelecionado(null); // Limpa o filme selecionado
  };

  return (
    <main className={styles.main}>
      {filmeSelecionado ? (
        // Exibe o player do filme se um filme estiver selecionado
        <section className={styles.playerContainer}>
          <h2>{filmeSelecionado.titulo}</h2>
          <iframe
            className={styles.iframe}
            src={filmeSelecionado.iframeSrc}
            width="560"
            height="384"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
          ></iframe>
          <button onClick={voltarParaLista} className={styles.botaoVoltar}>
            Voltar para a lista
          </button>
        </section>
      ) : (
        // Exibe a lista de filmes se nenhum filme estiver selecionado
        <>
          <h3>Lista de Filmes</h3>
          <section className={styles.capasContainer}>
            {filmes.map((filme) => (
              <section
                key={filme.id}
                className={styles.capa}
                onClick={() => handleClick(filme)} // Passa o filme inteiro
              >
                <img src={filme.capa} alt={`Capa do ${filme.titulo}`} />
                <p>
                  {filme.titulo}
                  <br/>
                  {filme.ano}
                </p>
              </section>
            ))}
          </section>
        </>
      )}
    </main>
  );
}