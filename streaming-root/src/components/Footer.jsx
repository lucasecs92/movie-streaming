import styles from "../styles/Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2026 Cineminha. Todos os direitos reservados.</p>
      <ul className={styles.footerLinks}>
        <li><a href="/terms">Termos de Uso</a></li>
        <li><a href="/privacy">Política de Privacidade</a></li>
      </ul>
    </footer>
  );
}