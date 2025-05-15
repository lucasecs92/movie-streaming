"use client";

import { IoClose, IoMenuSharp } from "react-icons/io5";
import { MdOutlineHome, MdOutlineLocalMovies, MdLiveTv, MdLogout } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Header.module.scss";
import supabase from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext'; // Import useLoading (adjust path if needed)

export default function Header({ onFilmesClick, onSeriesClick, onLoginClick, onCadastroClick }) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { setIsLoading, isLoading: isGlobalLoading } = useLoading(); // Get setIsLoading

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

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      authStateChangeData?.subscription?.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsLoading(true); // Show global loader
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao deslogar:", error);
        // Optionally, show an error to the user via a toast or context-based notification
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
      // Optionally show an error
    }
    finally {
      setIsLoading(false); // Hide global loader
    }
  };

  const toggleDropdown = () => {
    if (isGlobalLoading) return; // Prevent opening dropdown if loading
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileMenuClick = (actionCallback) => {
    if (isGlobalLoading) return; // Prevent action if loading
    if (actionCallback) {
      actionCallback();
    }
    setMenuOpen(false);
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
                      Home
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
                <li onClick={isGlobalLoading ? undefined : () => onFilmesClick(true)}>Home</li>
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
            <li className={styles.userSection} ref={dropdownRef}>
              <section className={styles.userName} onClick={toggleDropdown}>
                {userName}!
              </section>
              {isDropdownOpen && (
                <section className={styles.dropdownMenu} onClick={handleLogout}>
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