"use client";

import styles from "../styles/Main.module.scss";
import { useRouter } from "next/navigation";
import { filmes } from "../data/filmes";

export default function Main() {
  const router = useRouter();

  // Função para redirecionar ao clicar em uma capa
  const handleClick = (id) => {
    router.push(`/filme/${id}`); // Redireciona para a página do filme com o ID
  };

  return (
    <main className={styles.main}>
      <h3>Lista de Filmes</h3>
      <div className={styles.capasContainer}>
        {filmes.map((filme) => (
          <div
            key={filme.id}
            className={styles.capa}
            onClick={() => handleClick(filme.id)} // Passa o ID do filme
          >
            <img src={filme.capa} alt={`Capa do ${filme.titulo}`} />
            <p>{filme.titulo}</p>
          </div>
        ))}
      </div>
    </main>
  );
}