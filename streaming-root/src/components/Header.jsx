// Header.jsx
import { IoClose, IoMenuSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import styles from "../styles/Header.module.scss";

export default function Header({ onFilmesClick, onSeriesClick, onLoginClick, onCadastroClick, onLogoutClick, user }) { // Adicione onLogoutClick e user
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
      if (window.innerWidth > 820) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <h1 onClick={() => onFilmesClick(true)}>Cineminha</h1>
        {isMobile ? (
          <>
            {menuOpen ? (
              <IoClose className={styles.menuIcon} onClick={toggleMenu} />
            ) : (
              <IoMenuSharp className={styles.menuIcon} onClick={toggleMenu} />
            )}
            {menuOpen && (
              <ul className={styles.navLeftUlMobile}>
                {user && <li onClick={() => onFilmesClick(true)}>Home</li>} {/* Mostrar apenas se logado */}
                {user && <li onClick={() => onFilmesClick(false)}>Filmes</li>} {/* Mostrar apenas se logado */}
                {user && <li onClick={onSeriesClick}>Séries</li>} {/* Mostrar apenas se logado */}
                <hr className={styles.divider} />
                <li className={styles.btnLoginMobile} onClick={onLoginClick}>
                  LOGIN
                </li>
              </ul>
            )}
          </>
        ) : (
          <ul className={styles.navLeftUl}>
            {user && <li onClick={() => onFilmesClick(true)}>Home</li>} {/* Mostrar apenas se logado */}
            {user && <li onClick={() => onFilmesClick(false)}>Filmes</li>} {/* Mostrar apenas se logado */}
            {user && <li onClick={onSeriesClick}>Séries</li>} {/* Mostrar apenas se logado */}
          </ul>
        )}
      </nav>

      <nav className={styles.navRight}>
        <ul className={styles.navRightUl}>
          {user ? (
            <>
              <li className={styles.userName}>Olá, {user.email}</li>
              <li className={styles.btnLogout} onClick={onLogoutClick}> {/* Botão de Logout */}
                LOGOUT
              </li>
            </>
          ) : (
            <>
              <li className={styles.btnLogin} onClick={onLoginClick}>
                LOGIN
              </li>
              <li className={styles.btnCadastro} onClick={onCadastroClick}>
                CADASTRO
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}