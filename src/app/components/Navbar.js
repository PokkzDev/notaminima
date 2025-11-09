'use client';

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX, faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering auth-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(`.${styles.navbar}`)) {
        setIsMenuOpen(false);
      }
    };

    // Close menu on resize if window becomes larger
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleBackdropClick = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {isMenuOpen && (
        <div 
          className={styles.backdrop}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
            <span className={styles.logoText}>NotaMinima</span>
          </Link>

          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <FontAwesomeIcon 
              icon={isMenuOpen ? faX : faBars} 
              className={styles.hamburgerIcon}
            />
          </button>

          <div className={`${styles.navLinksContainer} ${isMenuOpen ? styles.navLinksContainerOpen : ''}`}>
            <ul className={styles.navLinks}>
              {mounted && status === 'authenticated' && (
                <li>
                  <Link href="/promedio" className={styles.navLink} onClick={closeMenu}>
                    Promedio
                  </Link>
                </li>
              )}
              <li>
                <Link href="/puntaje-a-nota" className={styles.navLink} onClick={closeMenu}>
                  Puntaje a Nota
                </Link>
              </li>
              <li>
                <Link href="/escala-de-notas" className={styles.navLink} onClick={closeMenu}>
                  Escala de Notas
                </Link>
              </li>
            </ul>
            
            <div className={styles.separator}></div>
            
            <ul className={styles.navLinks}>
              <li>
                <Link href="/acerca" className={styles.navLink} onClick={closeMenu}>
                  Acerca
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className={styles.navLink} onClick={closeMenu}>
                  Ayuda
                </Link>
              </li>
              <li>
                <ThemeToggle />
              </li>
              {status === 'authenticated' ? (
                <li className={styles.authItem}>
                  <div className={styles.userMenuContainer}>
                    <button
                      className={styles.userButton}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      aria-label="User menu"
                    >
                      <FontAwesomeIcon icon={faUser} />
                      <span className={styles.userEmail}>{session.user.email}</span>
                    </button>
                    {isUserMenuOpen && (
                      <div className={styles.userMenu}>
                        <div className={styles.userInfo}>
                          <p className={styles.userName}>{session.user.name || session.user.email}</p>
                          <p className={styles.userEmailSmall}>{session.user.email}</p>
                        </div>
                        <Link
                          href="/cuenta"
                          className={styles.menuLink}
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            closeMenu();
                          }}
                        >
                          <FontAwesomeIcon icon={faCog} />
                          Mi Cuenta
                        </Link>
                        <button
                          className={styles.signOutButton}
                          onClick={handleSignOut}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} />
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ) : (
                <li className={styles.authItem}>
                  <Link href="/login" className={styles.loginButton} onClick={closeMenu}>
                    Iniciar Sesión
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
