"use client";

import styles from "../styles/Main.module.scss";
import { useCallback, useEffect, useState } from "react";
import { filmes } from "../data/filmes";
import { shows } from "../data/shows";
import MovieList from "./MovieList";
import ShowsList from "./ShowsList";
import ShowDetails from "./ShowDetails";
import MovieDetails from "./MovieDetails";
import supabase from '../../lib/supabaseClient';
import { useLoading } from '../contexts/LoadingContext';

const LOADER_DURATION = 250; // milliseconds

export default function Main({
  showBanner,
  filmeSelecionado,
  setFilmeSelecionado,
  setShowHeaderFooter,
  isSeries,
  onLoginClick
}) {
  const [session, setSession] = useState(null);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleClick = useCallback((item) => {
    setIsLoading(true);
    setFilmeSelecionado(item);
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  }, [setFilmeSelecionado, setIsLoading]);

  const handleVoltarParaListaPrincipal = useCallback(() => {
    setIsLoading(true);
    setFilmeSelecionado(null);
    setShowHeaderFooter(true); // Mostrar header/footer ao voltar para a lista
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  }, [setFilmeSelecionado, setIsLoading, setShowHeaderFooter]);

  return (
    <main className={styles.main}>
      {filmeSelecionado ? (
        isSeries ? (
          <ShowDetails
            show={filmeSelecionado} 
            voltarParaLista={handleVoltarParaListaPrincipal}
            setShowHeaderFooter={setShowHeaderFooter} 
          />
        ) : (
          <MovieDetails 
            filme={filmeSelecionado} 
            voltarParaLista={handleVoltarParaListaPrincipal}
            setShowHeaderFooter={setShowHeaderFooter}
          />
        )
      ) : (
        <>
          {showBanner ? (
            <section className={styles.homeContainer}>
              {session ? (
                <section className={styles.banner}>
                  <h2>Bem-vindo(a) ao Cineminha!</h2>
                  <p>Assista aos melhores filmes e séries aqui.</p>
                </section>
              ) : (
                <section className={styles.banner}>
                  <h2>Bem-vindo(a) ao Cineminha!</h2>
                  <button className={styles.startButton} onClick={onLoginClick}>
                    Começar
                  </button>
                  <section className={styles.screenContainer}>
                    <img src="/images/dashboard-cineminha.png" alt="Screenshot do cineminha" />
                  </section>
                </section>
              )}
            </section>
          ) : isSeries ? (
            <ShowsList
              shows={shows}
              handleClick={handleClick} 
            />
          ) : (
            <MovieList
              filmes={filmes}
              handleClick={handleClick} 
            />
          )}
        </>
      )}
    </main>
  );
}