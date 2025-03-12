import Image from "next/image";
import styles from "../styles/page.module.scss";

export default function Home() {
  return (
    <section className={styles.containerPage}>
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
      <main className={styles.main}>
        <h3>Hello World</h3>
      </main>
      <footer className={styles.footer}>
      </footer>
    </section>
  );
}
