import { IoClose, IoMenuSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useState, useEffect, useRef } from "react"; 
import styles from "../styles/Header.module.scss";
import supabase from '../../lib/supabaseClient';

export default function Header({ onFilmesClick, onSeriesClick, onLoginClick, onCadastroClick }) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null); 

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUserName(session.user.user_metadata.full_name || session.user.email);
      } else {
        setUserName(null);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserName(session.user.user_metadata.full_name || session.user.email);
      } else {
        setUserName(null);
      }
    });

    // Função para fechar o dropdown ao clicar fora
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Adiciona o listener ao montar o componente
    document.addEventListener('mousedown', handleClickOutside);

    // Remove o listener ao desmontar o componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao deslogar:", error);
    } else {
      console.log("Deslogado com sucesso");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
                {session ? (
                  <>
                    <li onClick={() => onFilmesClick(true)}>Home</li>
                    <li onClick={() => onFilmesClick(false)}>Filmes</li>
                    <li onClick={onSeriesClick}>Séries</li>
                  </>
                ) : null}
                <hr className={styles.divider} />
                {session ? (
                  <li className={styles.btnLoginMobile} onClick={handleLogout}>
                    <MdLogout />
                    Sair
                  </li>
                ) : (
                  <li className={styles.btnLoginMobile} onClick={onLoginClick}>
                    LOGIN
                  </li>
                )}
              </ul>
            )}
          </>
        ) : (
          <ul className={styles.navLeftUl}>
            {session ? (
              <>
                <li onClick={() => onFilmesClick(true)}>Home</li>
                <li onClick={() => onFilmesClick(false)}>Filmes</li>
                <li onClick={onSeriesClick}>Séries</li>
              </>
            ) : null}
          </ul>
        )}
      </nav>

      <nav className={styles.navRight}>
        <ul className={styles.navRightUl}>
          {session ? (
            <li className={styles.userSection} ref={dropdownRef}>
              <section className={styles.userName} onClick={toggleDropdown}>
                {userName}!
              </section>
              {isDropdownOpen && (
                <section className={styles.dropdownMenu} onClick={handleLogout}>
                  <MdLogout />
                  <section className={styles.btnLogout} >
                    Sair
                  </section>
                </section>
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