'use client';

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX, faUser, faSignOutAlt, faCog, faChartLine, faChevronDown, faUserShield } from '@fortawesome/free-solid-svg-icons';
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
      // Close user dropdown when clicking outside
      if (isUserMenuOpen && !event.target.closest(`.${styles.userMenuContainer}`)) {
        setIsUserMenuOpen(false);
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
  }, [isMenuOpen, isUserMenuOpen]);

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
            {/* Mobile: User section at top */}
            {mounted && status === 'authenticated' && (
              <div className={styles.mobileUserSection}>
                <div className={styles.mobileUserInfo}>
                  <FontAwesomeIcon icon={faUser} className={styles.mobileUserIcon} />
                  <div>
                    <p className={styles.mobileUserName}>{session.user.name || session.user.email}</p>
                    <p className={styles.mobileUserEmail}>{session.user.email}</p>
                  </div>
                </div>
                <Link
                  href="/cuenta/dashboard"
                  className={styles.mobileMenuLink}
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  Dashboard
                </Link>
                <Link
                  href="/cuenta"
                  className={styles.mobileMenuLink}
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faCog} />
                  Mi Cuenta
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={styles.mobileMenuLink}
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faUserShield} />
                    Admin
                  </Link>
                )}
                <div className={styles.separator}></div>
              </div>
            )}

            {/* Mobile: Login/Register buttons at top for guests */}
            {mounted && status === 'unauthenticated' && (
              <div className={styles.mobileLoginSection}>
                <Link href="/login" className={styles.loginButton} onClick={closeMenu}>
                  Iniciar Sesión
                </Link>
                <Link href="/register" className={styles.registerButton} onClick={closeMenu}>
                  Registrarse
                </Link>
                <div className={styles.separator}></div>
              </div>
            )}

            {/* Main navigation links */}
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
            
            {/* Secondary links */}
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
            </ul>

            {/* Bottom section: Theme toggle and sign out */}
            <div className={styles.mobileBottomSection}>
              <div className={styles.separator}></div>
              <div className={styles.mobileBottomActions}>
                <ThemeToggle />
                {mounted && status === 'authenticated' && (
                  <button
                    className={styles.mobileSignOutButton}
                    onClick={handleSignOut}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </div>

            {/* Desktop: Secondary links with auth */}
            <ul className={styles.desktopSecondaryLinks}>
              <li>
                <ThemeToggle />
              </li>
              {mounted && status === 'authenticated' && (
                <li className={styles.desktopAuthItem}>
                  <div className={styles.userMenuContainer}>
                    <button
                      className={`${styles.userButton} ${isUserMenuOpen ? styles.userButtonOpen : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }}
                      aria-label="Menú de usuario"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                    >
                      <span className={styles.userAvatar}>
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                      <span className={styles.userDisplayName}>{session.user.name || session.user.email.split('@')[0]}</span>
                      <FontAwesomeIcon icon={faChevronDown} className={`${styles.chevron} ${isUserMenuOpen ? styles.chevronOpen : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                      <div className={styles.userMenu} role="menu">
                        <div className={styles.userInfo}>
                          <p className={styles.userName}>{session.user.name || session.user.email}</p>
                          <p className={styles.userEmailSmall}>{session.user.email}</p>
                        </div>
                        <Link
                          href="/cuenta/dashboard"
                          className={styles.menuLink}
                          role="menuitem"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            closeMenu();
                          }}
                        >
                          <FontAwesomeIcon icon={faChartLine} />
                          Dashboard
                        </Link>
                        <Link
                          href="/cuenta"
                          className={styles.menuLink}
                          role="menuitem"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            closeMenu();
                          }}
                        >
                          <FontAwesomeIcon icon={faCog} />
                          Mi Cuenta
                        </Link>
                        {session.user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className={styles.menuLink}
                            role="menuitem"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            <FontAwesomeIcon icon={faUserShield} />
                            Admin
                          </Link>
                        )}
                        <button
                          className={styles.signOutButton}
                          role="menuitem"
                          onClick={handleSignOut}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} />
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )}
              {mounted && status === 'unauthenticated' && (
                <li className={styles.authItem}>
                  <Link href="/login" className={styles.loginButton} onClick={closeMenu}>
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className={styles.registerButton} onClick={closeMenu}>
                    Registrarse
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
