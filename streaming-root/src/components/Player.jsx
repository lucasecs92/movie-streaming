"use client";

import styles from "../styles/Player.module.scss";
import { IoChevronBack } from "react-icons/io5";
import { useMemo } from 'react';

const Player = ({ filmeSelecionado, voltarParaLista }) => {
  // Processa o iframeSrc para incluir parâmetros de autoplay e mute
  const processedIframeSrc = useMemo(() => {
    if (!filmeSelecionado?.iframeSrc) {
      return ""; // Retorna string vazia se não houver src
    }

    const originalSrc = filmeSelecionado.iframeSrc;

    try {
      // Tenta usar a API URL para adicionar/modificar parâmetros de forma robusta
      const url = new URL(originalSrc);
      url.searchParams.set("autoplay", "1");
      // Mudo é frequentemente necessário para autoplay funcionar em navegadores modernos
      url.searchParams.set("mute", "1");
      return url.toString();
    } catch (error) {
      // Fallback para manipulação de string se a API URL falhar (ex: URL relativa ou malformada)
      console.warn(
        `Falha ao parsear iframeSrc ("${originalSrc}") como URL. Tentando anexar parâmetros de autoplay via manipulação de string. Isso pode resultar em uma URL inválida se a originalSrc for complexa. Erro original:`,
        error
      );

      let finalSrc = originalSrc;
      const queryParamsToAdd = [];

      // Adiciona autoplay=1 se não estiver presente
      if (!finalSrc.match(/[?&]autoplay=[01]/)) {
        queryParamsToAdd.push("autoplay=1");
      }
      // Adiciona mute=1 se não estiver presente
      if (!finalSrc.match(/[?&]mute=[01]/)) {
        queryParamsToAdd.push("mute=1");
      }

      if (queryParamsToAdd.length > 0) {
        const existingQuerySeparator = finalSrc.includes("?") ? "&" : "?";
        finalSrc += existingQuerySeparator + queryParamsToAdd.join("&");
      }
      return finalSrc;
    }
  }, [filmeSelecionado?.iframeSrc]); // Recalcula apenas se iframeSrc mudar

  // Se não houver filme selecionado ou src, não renderiza o player
  if (!filmeSelecionado || !filmeSelecionado.iframeSrc) {
    return null;
  }

  return (
    <section className={styles.playerContainer}>
      <span onClick={voltarParaLista} className={styles.botaoWrap}>
        <IoChevronBack className={styles.iconVoltar} />
        <h2 className={styles.titulo}>{filmeSelecionado.titulo}</h2>
      </span>
      <iframe
        className={styles.iframe}
        key={filmeSelecionado.id || filmeSelecionado.iframeSrc}
        src={processedIframeSrc}
        width="560"
        height="384"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    </section>
  );
};

export default Player;
