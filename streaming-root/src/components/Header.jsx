"use client";

import PropTypes from "prop-types";
import { IoClose, IoMenuSharp } from "react-icons/io5";
import {
  MdOutlineHome,
  MdOutlineLocalMovies,
  MdLiveTv,
  MdLogout
} from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Header.module.scss";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useLoading } from "../contexts/LoadingContext";

export default function Header({
  onFilmesClick,
  onSeriesClick,
  onLoginClick,
  onCadastroClick
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const router = useRouter();
  const { setIsLoading, isLoading } = useLoading();

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
      if (window.innerWidth > 820) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Busca sessão inicial
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUserName(currentSession?.user?.user_metadata?.full_name || currentSession?.user?.email || null);
    });

    // Escuta mudanças (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUserName(currentSession?.user?.user_metadata?.full_name || currentSession?.user?.email || null);
      
      if (event === "SIGNED_OUT") {
        setIsDropdownOpen(false);
        setMenuOpen(false);
      }
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // 1. Limpa a sessão no Supabase
      await supabase.auth.signOut();
      
      // 2. Limpa estados locais imediatamente
      setSession(null);
      setUserName(null);
      setIsDropdownOpen(false);
      setMenuOpen(false);

      // 3. Reset de navegação
      onFilmesClick(true);
      
      // 4. Força o redirecionamento e recarregamento leve para limpar caches de auth
      router.push("/");
      router.refresh(); 

    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <h1 className={styles.logo}>
          <button
            type="button"
            className={styles.logoButton}
            onClick={() => { onFilmesClick(true); setMenuOpen(false); }}
          >
            Cineminha
          </button>
        </h1>

        {isMobile ? (
          <>
            <button
              type="button"
              className={styles.menuIcon}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <IoClose /> : <IoMenuSharp />}
            </button>

            {menuOpen && (
              <ul className={styles.navLeftUlMobile}>
                {session && (
                  <>
                    <li><button onClick={() => { onFilmesClick(true); setMenuOpen(false); }}><MdOutlineHome /> Início</button></li>
                    <li><button onClick={() => { onFilmesClick(false); setMenuOpen(false); }}><MdOutlineLocalMovies /> Filmes</button></li>
                    <li><button onClick={() => { onSeriesClick(); setMenuOpen(false); }}><MdLiveTv /> Séries</button></li>
                  </>
                )}
                <hr className={styles.divider} />
                <li>
                  {session ? (
                    <button className={styles.btnLogoutMobile} onClick={handleLogout}>
                      <MdLogout /> Sair
                    </button>
                  ) : (
                    <button className={styles.btnLoginMobile} onClick={() => { onLoginClick(); setMenuOpen(false); }}>
                      LOGIN
                    </button>
                  )}
                </li>
              </ul>
            )}
          </>
        ) : (
          <ul className={styles.navLeftUl}>
            {session && (
              <>
                <li><button onClick={() => onFilmesClick(true)}>Início</button></li>
                <li><button onClick={() => onFilmesClick(false)}>Filmes</button></li>
                <li><button onClick={onSeriesClick}>Séries</button></li>
              </>
            )}
          </ul>
        )}
      </nav>

      <nav className={styles.navRight}>
        <ul className={styles.navRightUl}>
          {session ? (
            <li className={styles.userSection} ref={dropdownRef}>
              <button
                type="button"
                className={styles.userName}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {userName} {isDropdownOpen ? "▲" : "▼"}
              </button>

              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <MdLogout /> Sair
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li><button className={styles.btnLogin} onClick={onLoginClick}>LOGIN</button></li>
              <li><button className={styles.btnCadastro} onClick={onCadastroClick}>CADASTRO</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

Header.propTypes = {
  onFilmesClick: PropTypes.func.isRequired,
  onSeriesClick: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onCadastroClick: PropTypes.func.isRequired
};