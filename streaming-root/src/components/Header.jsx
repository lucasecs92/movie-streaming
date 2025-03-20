import styles from "../styles/Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      
      <nav className={styles.navLeft}>
        <h1>Cineminha</h1>
        <ul className={styles.navLeftUl}>
          <li>
            Home
          </li>
          <li>
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