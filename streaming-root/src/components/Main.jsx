"use client";

import styles from "../styles/Main.module.scss";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types"; 
import { filmes } from "../data/filmes";
import { shows } from "../data/shows";
import MovieList from "./MovieList";
import ShowsList from "./ShowsList";
import ShowDetails from "./ShowDetails";
import MovieDetails from "./MovieDetails";
import supabase from '../../lib/supabaseClient';
import { useLoading } from '../contexts/LoadingContext';

const LOADER_DURATION = 250;

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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
    setShowHeaderFooter(true);
    setTimeout(() => {
      setIsLoading(false);
    }, LOADER_DURATION);
  }, [setFilmeSelecionado, setIsLoading, setShowHeaderFooter]);

  // 2. Extração da lógica de renderização para evitar ternários aninhados
  const renderContent = () => {
    // Caso 1: Item selecionado (Detalhes)
    if (filmeSelecionado) {
      if (isSeries) {
        return (
          <ShowDetails
            show={filmeSelecionado}
            voltarParaLista={handleVoltarParaListaPrincipal}
            setShowHeaderFooter={setShowHeaderFooter}
          />
        );
      }
      return (
        <MovieDetails
          filme={filmeSelecionado}
          voltarParaLista={handleVoltarParaListaPrincipal}
          setShowHeaderFooter={setShowHeaderFooter}
        />
      );
    }

    // Caso 2: Banner inicial
    if (showBanner) {
      return (
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
      );
    }

    // Caso 3: Listagem (Filmes ou Séries)
    if (isSeries) {
      return <ShowsList shows={shows} handleClick={handleClick} />;
    }

    return <MovieList filmes={filmes} handleClick={handleClick} />;
  };

  return (
    <main className={styles.main}>
      {renderContent()}
    </main>
  );
}

// 3. Adicionar validação de Props para corrigir os erros de linting
Main.propTypes = {
  showBanner: PropTypes.bool.isRequired,
  filmeSelecionado: PropTypes.object,
  setFilmeSelecionado: PropTypes.func.isRequired,
  setShowHeaderFooter: PropTypes.func.isRequired,
  isSeries: PropTypes.bool.isRequired,
  onLoginClick: PropTypes.func.isRequired,
};