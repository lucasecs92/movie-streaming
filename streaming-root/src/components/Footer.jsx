import PropTypes from "prop-types"; 
import styles from "../styles/Footer.module.scss";

export default function Footer({ onTermsClick, onPrivacyClick }) {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2026 Cineminha. Todos os direitos reservados.</p>
      <ul className={styles.footerLinks}>
        <li>
          <button 
            type="button" 
            onClick={(e) => { e.preventDefault(); onTermsClick(); }} 
            className={styles.linkButton}
          >
            Termos de Uso
          </button>
        </li>
        <li>
          <button 
            type="button" 
            onClick={(e) => { e.preventDefault(); onPrivacyClick(); }} 
            className={styles.linkButton}
          >
            Política de Privacidade
          </button>
        </li>
      </ul>
    </footer>
  );
}

// validação das props
Footer.propTypes = {
  onTermsClick: PropTypes.func.isRequired,
  onPrivacyClick: PropTypes.func.isRequired,
};