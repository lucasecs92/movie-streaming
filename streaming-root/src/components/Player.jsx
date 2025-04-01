"use client";

import styles from "../styles/Player.module.scss";
import { IoChevronBack } from "react-icons/io5";

const Player = ({ filmeSelecionado, voltarParaLista }) => {
  return (
    <section className={styles.playerContainer}>
      <span onClick={voltarParaLista} className={styles.botaoWrap}>
        <IoChevronBack className={styles.iconVoltar} />
        <h2 className={styles.titulo}>{filmeSelecionado.titulo}</h2>
      </span>
      <iframe
        className={styles.iframe}
        src={filmeSelecionado.iframeSrc}
        width="560"
        height="384"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowFullScreen
      ></iframe>
    </section>
  );
};

export default Player;
