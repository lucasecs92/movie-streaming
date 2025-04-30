import { IoClose, IoMenuSharp } from "react-icons/io5";
import { useState, useEffect, useRef } from "react"; // Import useRef
import styles from "../styles/Header.module.scss";
import { CiLogout } from "react-icons/ci";

export default function Header({
  onFilmesClick,
  onSeriesClick,
  onLoginClick,
  onCadastroClick,
  onLogoutClick,
  user,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Novo estado para o menu do usuário
  const userMenuRef = useRef(null); // Referência para o menu do usuário

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
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
                {user && <li onClick={() => onFilmesClick(true)}>Home</li>}
                {user && <li onClick={() => onFilmesClick(false)}>Filmes</li>}
                {user && <li onClick={onSeriesClick}>Séries</li>}
                <hr className={styles.divider} />
                <li className={styles.btnLoginMobile} onClick={onLoginClick}>
                  LOGIN
                </li>
              </ul>
            )}
          </>
        ) : (
          <ul className={styles.navLeftUl}>
            {user && <li onClick={() => onFilmesClick(true)}>Home</li>}
            {user && <li onClick={() => onFilmesClick(false)}>Filmes</li>}
            {user && <li onClick={onSeriesClick}>Séries</li>}
          </ul>
        )}
      </nav>

      <nav className={styles.navRight}>
        <ul className={styles.navRightUl}>
          {user ? (
            <li className={styles.userName} onClick={toggleUserMenu}>
              <li className={styles.userNameWrap}>
                Olá, {user.email}
              </li>

              {userMenuOpen && (
                <ul className={styles.userMenu} ref={userMenuRef}>
                  <li className={styles.btnLogout} onClick={onLogoutClick}>
                    <CiLogout />
                    Sair
                  </li>
                </ul>
              )}
            </li>
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