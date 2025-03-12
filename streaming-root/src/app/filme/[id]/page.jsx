"use client";

import { useParams, useRouter } from "next/navigation";
import { filmes } from "../../../data/filmes"; // Importe a lista de filmes
import styles from "../../../styles/Filme.module.scss";

export default function Filme() {
  const router = useRouter();
  const params = useParams(); // Pega os parâmetros da URL
  const { id } = params;

  // Encontra o filme correspondente ao ID
  const filme = filmes.find((filme) => filme.id === Number(id));

  if (!filme) {
    return <div>Filme não encontrado</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{filme.titulo}</h1>
      <iframe
        className={styles.iframe}
        src={filme.iframeSrc}
        width="560"
        height="384"
        frameborder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowfullscreen
      ></iframe>
    </div>
  );
}