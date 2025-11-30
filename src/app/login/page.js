'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

// Extract redirect URL parsing logic
function getRedirectPath(callbackUrl) {
  if (!callbackUrl) {
    return '/';
  }
  
  try {
    // If callbackUrl is a full URL, extract the pathname
    const url = new URL(callbackUrl, globalThis.location.origin);
    // Only allow same-origin redirects for security
    if (url.origin === globalThis.location.origin) {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    // If callbackUrl is already a relative path, use it directly
    if (callbackUrl.startsWith('/')) {
      return callbackUrl;
    }
  }
  
  return '/';
}

function LoginContent() {
  useRouter(); // Keep for future use
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        identifier: identifier.trim(),
        password,
        redirect: false,
        rememberMe: rememberMe,
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days if remember me, 1 day otherwise
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      
      if (result?.ok) {
        setLoading(false);
        const callbackUrl = searchParams.get('callbackUrl');
        const redirectPath = getRedirectPath(callbackUrl);
        globalThis.location.href = redirectPath;
        return;
      }
      
      // Unexpected result
      setError('Error al iniciar sesión');
      setLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión');
      setLoading(false);
    }
  };



  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Iniciar Sesión</h1>
            <p className={styles.subtitle}>Accede a tu cuenta para gestionar tus promedios</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="identifier" className={styles.label}>
                <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                Usuario o Email
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={styles.input}
                placeholder="usuario o tu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                Contraseña
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <div className={styles.forgotPassword}>
                <Link href="/login/forgot-password" className={styles.forgotPasswordLink}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div className={styles.rememberMe}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className={styles.checkbox}
                />
                <span>Recordarme</span>
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className={styles.link}>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}

