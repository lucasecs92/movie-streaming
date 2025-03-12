import styles from "../styles/Main.module.scss";

export default function Main() {
  return (
    <main className={styles.main}>
      <h3>Lista de Filmes</h3>
      <iframe 
        src="https://archive.org/embed/101-pilot_202503" 
        width="560" 
        height="384" 
        frameborder="0" 
        webkitallowfullscreen="true" 
        mozallowfullscreen="true" 
        allowfullscreen
      >
      </iframe>
    </main>
  );
}