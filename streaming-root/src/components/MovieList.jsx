"use client";

import styles from "../styles/MovieList.module.scss";

const MovieList = ({ filmes, handleClick }) => {

  return (
    <section className={styles.listaContainer}>
      <h3>Filmes</h3>
      <section className={styles.gridFilmes}> 
        {filmes.map((filme) => (
          <section
            key={filme.id}
            className={styles.capaWrap} 
            onClick={() => handleClick(filme)} // Usa a prop handleClick
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClick(filme);
              }
            }}
          >
            <img
              src={filme.capa}
              alt={`Capa do ${filme.titulo}`}
            />
            <p> {/* Não precisa mais de onClick aqui se o wrapper já tem */}
              {filme.titulo}
              <br />
              {filme.ano}
            </p>
          </section>
        ))}
      </section>
    </section>
  );
};

export default MovieList;