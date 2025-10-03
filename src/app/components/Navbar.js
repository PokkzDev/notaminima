'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Promedio', href: '/promedio' },
    { name: 'Puntaje → Nota', href: '/puntaje-a-nota' },
    { name: 'FAQ', href: '/faq' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getLinkClassName = (href) => {
    const isActive = href === '/' ? pathname === '/' : pathname === href;
    return `${styles.navLink} ${isActive ? styles.active : ''}`;
  };

  return (
    <header className={styles.navbar}>
      <nav className={`${styles.navContainer} py-4 flex items-center justify-between gap-4`} aria-label="Navegación principal">
        {/* Logo/Brand */}
        <Link
          href="/"
          className={styles.navBrand}
          aria-label="Ir al inicio - Nota Mínima"
        >
          <div className={styles.navBrandLogo}>
            <Image
              src="/logo.png"
              alt="Logo Nota Mínima - Calculadora de notas Chile"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
            <div className={styles.navBrandIndicator}></div>
          </div>
          <span className={styles.navBrandText}>
            Nota Mínima
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navMenu}>
          {navigation.map((item, index) => (
            <div key={item.name} className={styles.navItem}>
              <Link
                href={item.href}
                className={getLinkClassName(item.href)}
                aria-label={`Ir a ${item.name}`}
              >
                {item.name}
              </Link>
              {index < navigation.length - 1 && (
                <span className={styles.navSeparator}>•</span>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className={`${styles.mobileNavToggle} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`${styles.mobileNavMenu} ${isMobileMenuOpen ? styles.show : ''}`}
        role="menu"
        aria-label="Mobile navigation menu"
      >
        {navigation.map((item) => (
          <div key={item.name} className={styles.navItem}>
            <Link
              href={item.href}
              className={`${styles.navLink} ${getLinkClassName(item.href)}`}
              role="menuitem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </header>
  );
}
