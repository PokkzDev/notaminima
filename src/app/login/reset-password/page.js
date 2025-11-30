'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faArrowLeft, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PasswordComplexity from '@/app/components/PasswordComplexity';
import styles from './page.module.css';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = loading, true = valid, false = invalid
  const [tokenChecked, setTokenChecked] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setTokenChecked(true);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();
        setTokenValid(data.valid === true);
      } catch (err) {
        setTokenValid(false);
      } finally {
        setTokenChecked(true);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al restablecer la contraseña');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Error al restablecer la contraseña');
      setLoading(false);
    }
  };

  // Loading state while checking token
  if (!tokenChecked) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Verificando enlace...</h1>
              <p className={styles.subtitle}>Por favor espera mientras verificamos tu enlace de recuperación.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Invalid or expired token
  if (!tokenValid) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.errorIcon}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className={styles.header}>
              <h1 className={styles.title}>Enlace inválido</h1>
              <p className={styles.subtitle}>
                El enlace de recuperación es inválido o ha expirado. Los enlaces de recuperación expiran después de 15 minutos.
              </p>
            </div>
            <Link href="/login/forgot-password" className={styles.primaryButton}>
              Solicitar nuevo enlace
            </Link>
            <div className={styles.footer}>
              <Link href="/login" className={styles.link}>
                <FontAwesomeIcon icon={faArrowLeft} className={styles.linkIcon} />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Success state
  if (success) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.successIcon}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className={styles.header}>
              <h1 className={styles.title}>Contraseña actualizada</h1>
              <p className={styles.subtitle}>
                Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión en unos segundos...
              </p>
            </div>
            <Link href="/login" className={styles.primaryButton}>
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Reset password form
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Nueva contraseña</h1>
            <p className={styles.subtitle}>
              Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
            </p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                Nueva contraseña
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
                  autoFocus
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
              <PasswordComplexity password={password} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                Confirmar contraseña
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className={styles.passwordMismatch}>Las contraseñas no coinciden</p>
              )}
              {confirmPassword && password === confirmPassword && password.length > 0 && (
                <p className={styles.passwordMatch}>Las contraseñas coinciden</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || password !== confirmPassword}
            >
              {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </button>
          </form>

          <div className={styles.footer}>
            <Link href="/login" className={styles.link}>
              <FontAwesomeIcon icon={faArrowLeft} className={styles.linkIcon} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
