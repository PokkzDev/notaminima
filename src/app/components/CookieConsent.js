'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './CookieConsent.module.css';

const COOKIE_CONSENT_KEY = 'notaminima_cookie_consent';
const COOKIE_CONSENT_EXPIRY_DAYS = 365;

export default function CookieConsent() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    // Don't show modal on login/register pages or if user is authenticated
    const isAuthPage = pathname === '/login' || pathname === '/register' || pathname?.startsWith('/register/');
    const isAuthenticated = status === 'authenticated';
    
    if (isAuthPage || isAuthenticated) {
      return;
    }
    
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid flash of content
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }
  }, [pathname, status]);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(
      `${COOKIE_CONSENT_KEY}_date`,
      new Date().toISOString()
    );
    setShowModal(false);
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cookieConsentChanged'));
    // Reload to ensure scripts are properly initialized
    window.location.reload();
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    localStorage.setItem(
      `${COOKIE_CONSENT_KEY}_date`,
      new Date().toISOString()
    );
    setShowModal(false);
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cookieConsentChanged'));
    // Disable Google Analytics if it was already loaded
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
      });
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted || !showModal) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>🍪 Uso de Cookies</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.description}>
            Utilizamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. 
            Al continuar navegando, aceptas el uso de cookies según nuestra{' '}
            <Link href="/privacidad" className={styles.link}>
              Política de Privacidad
            </Link>.
          </p>
        </div>
        <div className={styles.footer}>
          <button
            onClick={handleReject}
            className={styles.rejectButton}
            aria-label="Rechazar cookies"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className={styles.acceptButton}
            aria-label="Aceptar cookies"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

// Export function to check consent status (useful for other components)
export function hasCookieConsent() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
}

