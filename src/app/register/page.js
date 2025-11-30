'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faEye, faEyeSlash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { signIn } from 'next-auth/react';
import PasswordComplexity from '@/app/components/PasswordComplexity';
import { isValidPassword, isValidEmail } from '@/lib/validation';
import styles from './page.module.css';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Step state: 'email' or 'registration'
  const [step, setStep] = useState('email');
  const [verificationToken, setVerificationToken] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  
  // Email step state
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  // Registration step state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Common state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for token in URL on mount
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Validate token and switch to registration step
      const validateToken = async (token) => {
        setLoading(true);
        setError('');
        
        try {
          const response = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
          const data = await response.json();

          if (!response.ok) {
            setError(data.error || 'Token de verificación inválido o expirado');
            setLoading(false);
            return;
          }

          // Token is valid, switch to registration step
          setVerificationToken(token);
          setVerifiedEmail(data.email);
          setStep('registration');
          setLoading(false);
        } catch (err) {
          console.error('Token validation error:', err);
          setError('Error al verificar el token');
          setLoading(false);
        }
      };
      
      validateToken(token);
    }
  }, [searchParams]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailSent(false);

    // Validate email format
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('El email es requerido');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('El formato del email no es válido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al enviar el email de verificación');
        setLoading(false);
        return;
      }

      // Email sent successfully
      setEmailSent(true);
      setLoading(false);
    } catch (err) {
      console.error('Email verification error:', err);
      setError('Error al enviar el email de verificación');
      setLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!isValidPassword(password)) {
      setError('La contraseña debe cumplir todos los requisitos de complejidad');
      return;
    }

    // Validate username is provided
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('El nombre de usuario es requerido');
      return;
    }

    // Validate username length
    if (trimmedUsername.length > 100) {
      setError('El nombre de usuario no puede exceder 100 caracteres');
      return;
    }

    if (!verificationToken) {
      setError('Token de verificación no encontrado');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationToken,
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al crear la cuenta');
        setLoading(false);
        return;
      }

      // Auto login after registration
      const result = await signIn('credentials', {
        email: verifiedEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Cuenta creada pero error al iniciar sesión. Por favor inicia sesión manualmente.');
        setLoading(false);
        router.push('/login');
      } else {
        router.push('/promedio');
        router.refresh();
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Error al crear la cuenta');
      setLoading(false);
    }
  };

  // Email step UI
  if (step === 'email') {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Crear Cuenta</h1>
              <p className={styles.subtitle}>Ingresa tu email para comenzar</p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {emailSent ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  ✓ Email de verificación enviado
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación para continuar con el registro.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="tu@email.com"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Continuar'}
                </button>
              </form>
            )}

            <div className={styles.footer}>
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className={styles.link}>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Registration step UI
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Completa tu Registro</h1>
            <p className={styles.subtitle}>Email verificado: {verifiedEmail}</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegistrationSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="Tu nombre de usuario"
                required
                maxLength={100}
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
                  minLength={8}
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
              <PasswordComplexity password={password} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                Confirmar Contraseña
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
                  minLength={8}
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
              {password && confirmPassword && password === confirmPassword && (
                <div className={styles.passwordMatch}>
                  <FontAwesomeIcon icon={faCheck} className={styles.passwordMatchIcon} />
                  <span className={styles.passwordMatchText}>Contraseñas coinciden</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className={styles.link}>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Crear Cuenta</h1>
              <p className={styles.subtitle}>Cargando...</p>
            </div>
          </div>
        </div>
      </main>
    }>
      <RegisterContent />
    </Suspense>
  );
}

