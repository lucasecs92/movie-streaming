"use client";

import styles from "../styles/Main.module.scss";
import { useEffect, useState } from "react";
import { filmes } from "../data/filmes";

import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export default function Main() {
  const [filmeSelecionado, setFilmeSelecionado] = useState(null); // Estado para o filme selecionado
  const [slidesPerView, setSlidesPerView] = useState(4);

  // Função para exibir o filme selecionado
  const handleClick = (filme) => {
    setFilmeSelecionado(filme); // Define o filme selecionado
  };

  // Função para voltar à lista de filmes
  const voltarParaLista = () => {
    setFilmeSelecionado(null); // Limpa o filme selecionado
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 795) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(4);
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Configura o valor inicial
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <section className={styles.listaContainer}>
            <h3>Lista de Filmes</h3>
            <section className={styles.slideFilmes}>
              <Swiper
                modules={[Navigation]}
              //spaceBetween={10} // Espaço entre os slides
                slidesPerView={slidesPerView} // Número de slides visíveis
                slidesPerGroup={slidesPerView} // Número de slides a avançar de uma vez
                navigation // Botões de navegação
                loop={true} // Loop infinito
              >
                {filmes.map((filme) => {
                  return (
                    <SwiperSlide key={filme.id} className={styles.capa}>
                      <section className={styles.capaWrap}>
                        <img src={filme.capa} alt={`Capa do ${filme.titulo}`} onClick={() => handleClick(filme)}/>
                        <p onClick={() => handleClick(filme)}>
                          {filme.titulo}
                          <br/>
                          {filme.ano}
                        </p>
                      </section>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </section>
          </section>
        </>
      )}
    </main>
  );
}