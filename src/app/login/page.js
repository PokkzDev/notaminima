'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
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
      } else if (result?.ok) {
        // Login successful, redirect to landing page
        setLoading(false);
        router.push('/promedio');
        router.refresh();
      } else {
        // Unexpected result
        setError('Error al iniciar sesión');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      setLoading(false);
    }
  };

  // const handleGoogleSignIn = async () => {
  //   setError('');
  //   setLoading(true);
  //   try {
  //     await signIn('google', { callbackUrl: '/promedio' });
  //   } catch (err) {
  //     setError('Error al iniciar sesión con Google');
  //     setLoading(false);
  //   }
  // };

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

          {/* <div className={styles.divider}>
            <span>o</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className={styles.googleButton}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faGoogle} />
            Continuar con Google
          </button> */}

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

