"use client";

import styles from "../styles/MovieList.module.scss";

const ShowsList = ({ shows, handleClick }) => {

  return (
    <section className={styles.listaContainer}>
      <h3>Séries</h3>
      <section className={styles.gridShows}> 
        {shows.map((show) => (
          <section
            key={show.id}
            className={styles.capaWrap} 
            onClick={() => handleClick(show)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClick(show);
              }
            }}
          >
            <img
              src={show.capa}
              alt={`Capa de ${show.titulo}`}
            />
            <p> {/* Não precisa mais de onClick aqui se o wrapper já tem */}
              {show.titulo}
              <br />
              {show.ano}
            </p>
          </section>
        ))}
      </section>
    </section>
  );
};

export default ShowsList;