"use client";

import styles from "../styles/Main.module.scss";

const Player = ({ filmeSelecionado, voltarParaLista }) => {
  return (
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
  );
};

export default Player;