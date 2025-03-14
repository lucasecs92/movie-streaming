import styles from "../styles/Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <h1>Cineminha</h1>
        <ul className={styles.navLeftUl}>
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
      <nav className={styles.navMid}>
      </nav>
      <nav className={styles.navRight}>
        <a href="#" className={styles.btnLogin}>LOGIN</a>
        <a href="#" className={styles.btnCadastro}>CADASTRO</a>
      </nav>
    </header>
  );
}