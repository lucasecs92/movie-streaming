"use client";

import { IoClose, IoMenuSharp } from "react-icons/io5";
import { MdOutlineHome, MdOutlineLocalMovies, MdLiveTv, MdLogout } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Header.module.scss";
import supabase from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext';

export default function Header({ onFilmesClick, onSeriesClick, onLoginClick, onCadastroClick }) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { setIsLoading, isLoading: isGlobalLoading } = useLoading();
  const hoverTimeoutRef = useRef(null); 

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

    const { data: authStateChangeData } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserName(session.user.user_metadata.full_name || session.user.email);
      } else {
        setUserName(null);
        if (_event === "SIGNED_OUT") {
          setIsDropdownOpen(false);
        }
      }
    });

    return () => {
      authStateChangeData?.subscription?.unsubscribe();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current); 
      }
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao deslogar:", error);
      } else {
        console.log("Deslogado com sucesso");
        onFilmesClick(true);
        router.push('/');
        if (isMobile && menuOpen) {
          setMenuOpen(false);
        }
      }
    } catch (catchError) {
      console.error("Logout catch error:", catchError);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnterUserSection = () => {
    if (isGlobalLoading) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeaveUserSection = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Adjust delay as needed (e.g., 200-300ms)
  };

  const handleMobileMenuClick = (actionCallback) => {
    if (isGlobalLoading) return;
    if (actionCallback) {
      actionCallback();
    }
    setMenuOpen(false);
  };

  const handleMouseEnterDropdownMenu = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };


  return (
    <header className={styles.header}>
      <nav className={styles.navLeft}>
        <h1 onClick={() => {
          if (isGlobalLoading) return;
          onFilmesClick(true);
          if (isMobile && menuOpen) setMenuOpen(false);
        }}>Cineminha</h1>
        {isMobile ? (
          <>
            {menuOpen ? (
              <IoClose className={styles.menuIcon} onClick={isGlobalLoading ? undefined : toggleMenu} />
            ) : (
              <IoMenuSharp className={styles.menuIcon} onClick={isGlobalLoading ? undefined : toggleMenu} />
            )}
            {menuOpen && (
              <ul className={styles.navLeftUlMobile}>
                {session ? (
                  <>
                    <li onClick={() => handleMobileMenuClick(() => onFilmesClick(true))}>
                      <MdOutlineHome />
                      Início
                    </li>
                    <li onClick={() => handleMobileMenuClick(() => onFilmesClick(false))}>
                      <MdOutlineLocalMovies />
                      Filmes
                    </li>
                    <li onClick={() => handleMobileMenuClick(onSeriesClick)}>
                      <MdLiveTv />
                      Séries
                    </li>
                  </>
                ) : null}
                <hr className={styles.divider} />
                {session ? (
                  <li className={styles.btnLoginMobile} onClick={() => handleMobileMenuClick(handleLogout)}>
                    <MdLogout />
                    Sair
                  </li>
                ) : (
                  <li className={styles.btnLoginMobile} onClick={() => handleMobileMenuClick(onLoginClick)}>
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
                <li onClick={isGlobalLoading ? undefined : () => onFilmesClick(true)}>Início</li>
                <li onClick={isGlobalLoading ? undefined : () => onFilmesClick(false)}>Filmes</li>
                <li onClick={isGlobalLoading ? undefined : onSeriesClick}>Séries</li>
              </>
            ) : null}
          </ul>
        )}
      </nav>

      <nav className={styles.navRight}>
        <ul className={styles.navRightUl}>
          {session ? (
            <li
              className={styles.userSection}
              ref={dropdownRef}
            >
              <section 
                className={styles.userName}
                onMouseEnter={handleMouseEnterUserSection}
                onMouseLeave={handleMouseLeaveUserSection}
              >
                {userName}
              </section>
              {isDropdownOpen && (
                <section
                  className={styles.dropdownMenu}
                  onClick={handleLogout} 
                  onMouseEnter={handleMouseEnterDropdownMenu} 
                >
                  <MdLogout />
                  <section className={styles.btnLogout}>
                    Sair
                  </section>
                </section>
              )}
            </li>
          ) : (
            <>
              <li className={styles.btnLogin} onClick={isGlobalLoading ? undefined : onLoginClick}>
                LOGIN
              </li>
              <li className={styles.btnCadastro} onClick={isGlobalLoading ? undefined : onCadastroClick}>
                CADASTRO
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}