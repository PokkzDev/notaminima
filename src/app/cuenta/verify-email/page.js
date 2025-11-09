'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from '../page.module.css';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setError('Token de verificación no encontrado');
      return;
    }

    // Verify token via API
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/account/email/verify?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setError(data.error || 'Error al verificar el token');
          return;
        }

        // Token verified successfully, email updated
        setStatus('success');
        setMessage(data.message || 'Email actualizado correctamente');
        
        // Sign out to destroy the current session
        await signOut({ redirect: false });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setError('Error al verificar el token');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Verificando Cambio de Email</h1>
          </div>

          {status === 'verifying' && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Verificando tu nuevo email...</p>
            </div>
          )}

          {status === 'error' && (
            <>
              <div className={styles.errorMessage}>
                {error}
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Por favor, solicita un nuevo cambio de email desde tu cuenta.</p>
                <button
                  onClick={() => router.push('/cuenta')}
                  className={styles.submitButton}
                  style={{ marginTop: '1rem' }}
                >
                  Volver a Configuración
                </button>
              </div>
            </>
          )}

          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid rgba(34, 197, 94, 0.3)', 
                color: '#22c55e',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {message}
              </div>
              <p>Serás redirigido al inicio de sesión en unos segundos...</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Tu sesión ha sido cerrada por seguridad. Por favor, inicia sesión nuevamente con tu nuevo email.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Verificando Cambio de Email</h1>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Cargando...</p>
            </div>
          </div>
        </div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

