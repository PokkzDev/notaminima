'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <li>
                <Link href="/promedio" className={styles.navLink} onClick={closeMenu}>
                  Promedio
                </Link>
              </li>
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
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
