"use client";

import styles from "../styles/Header.module.scss";

export default function Header({ onFilmesClick }) {
  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <h1 onClick={() => onFilmesClick(true)}>Cineminha</h1> {/* Exibe o banner */}
        <ul className={styles.navLeftUl}>
          <li onClick={() => onFilmesClick(true)}> {/* Exibe o banner */}
            Home
          </li>
          <li onClick={() => onFilmesClick(false)}> {/* Oculta o banner */}
            Filmes
          </li>
          <li>
            Séries
          </li>
        </ul>
      </nav>

      <nav className={styles.navRight}>
        <ul className={styles.navRightUl}>
          <li className={styles.btnLogin}>
            LOGIN 
          </li>
          <li className={styles.btnCadastro}>
            CADASTRO
          </li>
        </ul>
      </nav>
    </header>
  );
}