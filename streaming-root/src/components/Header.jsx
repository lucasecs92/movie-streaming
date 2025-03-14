import styles from "../styles/Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <h1>Cineminha</h1>
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
        <a href="#" className={styles.btnLogin}>LOGIN</a>
        <a href="#" className={styles.btnCadastro}>CADASTRO</a>
      </nav>
    </header>
  );
}