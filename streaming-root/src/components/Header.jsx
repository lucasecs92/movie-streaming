import styles from "../styles/Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <h1>Meu Streaming</h1>
      </nav>
      <nav className={styles.navMid}>
        <ul className={styles.navMidUl}>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Filmes</a>
          </li>
          <li>
            <a href="#">Séries</a>
          </li>
        </ul>
      </nav>
      <nav className={styles.navRight}>
        <a href="#">Login</a>
        <a href="#">Cadastro</a>
      </nav>
    </header>
  );
}