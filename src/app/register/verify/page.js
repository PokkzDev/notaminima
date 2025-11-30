'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../page.module.css';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');

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
        const response = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setError(data.error || 'Error al verificar el token');
          return;
        }

        // Token verified successfully, redirect to registration form
        setStatus('success');
        // Redirect to registration page with token
        router.push(`/register?token=${encodeURIComponent(token)}`);
      } catch (err) {
        console.error('Email verification error:', err);
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
            <h1 className={styles.title}>Verificando Email</h1>
          </div>

          {status === 'verifying' && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Verificando tu email...</p>
            </div>
          )}

          {status === 'error' && (
            <>
              <div className={styles.errorMessage}>
                {error}
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Por favor, solicita un nuevo email de verificación.</p>
              </div>
            </>
          )}

          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Email verificado exitosamente. Redirigiendo...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Verificando Email</h1>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Cargando...</p>
            </div>
          </div>
        </div>
      </main>
    }>
      <VerifyContent />
    </Suspense>
  );
}

