import { IoClose, IoMenuSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import styles from "../styles/Header.module.scss";

export default function Header({ onFilmesClick, onLoginClick, onCadastroClick }) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
      if (window.innerWidth > 820) {
        setMenuOpen(false); // Fecha o menu se a tela for redimensionada para maior que 820px
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Verifica o tamanho da tela na montagem do componente

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <h1 onClick={() => onFilmesClick(true)}>Cineminha</h1> {/* Exibe o banner */}
        {isMobile ? (
          <>
            {menuOpen ? (
              <IoClose className={styles.menuIcon} onClick={toggleMenu} />
            ) : (
              <IoMenuSharp className={styles.menuIcon} onClick={toggleMenu} />
            )}
            {menuOpen && (
              <ul className={styles.navLeftUlMobile}>
                <li onClick={() => onFilmesClick(true)}> {/* Exibe o banner */}
                  Home
                </li>
                <li onClick={() => onFilmesClick(false)}> {/* Oculta o banner */}
                  Filmes
                </li>
                <li>
                  Séries
                </li>
                <hr className={styles.divider} />
                <li className={styles.btnLoginMobile} onClick={onLoginClick}>
                  LOGIN
                </li>
              </ul>
            )}
          </>
        ) : (
          <ul className={styles.navLeftUl}>
            <li onClick={() => onFilmesClick(true)}> {/* Exibe o banner */}
              Home
            </li>
            <li onClick={() => onFilmesClick(false)}> {/* Oculta o banner */}
              Filmes
            </li>
            <li>
              Séries
            </li>
          </ul>
        )}
      </nav>

      <nav className={styles.navRight}>
        <ul className={styles.navRightUl}>
          <li className={styles.btnLogin} onClick={onLoginClick}>
            LOGIN 
          </li>
          <li className={styles.btnCadastro} onClick={onCadastroClick}>
            CADASTRO
          </li>
        </ul>
      </nav>
    </header>
  );
}