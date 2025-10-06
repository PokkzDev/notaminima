'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import styles from './PuntajeNota.module.css';

export default function PuntajeANota() {
  const [puntajeObtenido, setPuntajeObtenido] = useState('60');
  const [puntajeTotal, setPuntajeTotal] = useState('100');
  const [exigencia, setExigencia] = useState('60');
  const [nota, setNota] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenido = parseFloat(puntajeObtenido);
    const total = parseFloat(puntajeTotal);
    const exig = parseFloat(exigencia);

    if (isNaN(obtenido) || isNaN(total) || isNaN(exig)) {
      setNota(null);
      setError('');
      return;
    }

    if (total <= 0 || exig <= 0 || exig > 100 || obtenido < 0) {
      setNota(null);
      setError('');
      return;
    }

    if (obtenido > total) {
      setNota(null);
      setError('El puntaje obtenido no puede ser mayor que el puntaje total');
      return;
    }

    setError('');

    const puntajeMinimo = total * (exig / 100);
    
    let notaCalculada;
    if (obtenido >= puntajeMinimo) {
      notaCalculada = 4.0 + 3.0 * ((obtenido - puntajeMinimo) / (total - puntajeMinimo));
    } else {
      notaCalculada = 1.0 + 3.0 * (obtenido / puntajeMinimo);
    }

    notaCalculada = Math.max(1.0, Math.min(7.0, notaCalculada));
    
    // Detectar si los valores tienen decimales
    const tieneDecimales = !Number.isInteger(obtenido) || !Number.isInteger(total);
    const decimales = tieneDecimales ? 2 : 1;
    
    setNota(notaCalculada.toFixed(decimales));
  }, [puntajeObtenido, puntajeTotal, exigencia]);

  const limpiarFormulario = () => {
    setPuntajeObtenido('60');
    setPuntajeTotal('100');
    setExigencia('60');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Puntaje a Nota</h1>
          <p className={styles.subtitle}>
            Convierte tus puntajes de evaluaciones a notas según el sistema chileno
          </p>
        </header>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Ingresa los Datos</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="puntajeObtenido" className={styles.label}>
                  Puntaje Obtenido
                </label>
                <input
                  type="number"
                  id="puntajeObtenido"
                  className={styles.input}
                  value={puntajeObtenido}
                  onChange={(e) => setPuntajeObtenido(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="puntajeTotal" className={styles.label}>
                  Puntaje Total
                </label>
                <input
                  type="number"
                  id="puntajeTotal"
                  className={styles.input}
                  value={puntajeTotal}
                  onChange={(e) => setPuntajeTotal(e.target.value)}
                  min="1"
                  step="0.1"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="exigencia" className={styles.label}>
                  Exigencia (%)
                </label>
                <input
                  type="number"
                  id="exigencia"
                  className={styles.input}
                  value={exigencia}
                  onChange={(e) => setExigencia(e.target.value)}
                  min="1"
                  max="100"
                  step="1"
                />
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <div className={styles.buttonGroup}>
                <button 
                  onClick={limpiarFormulario} 
                  className={styles.resetButton}
                >
                  <FontAwesomeIcon icon={faRotateRight} />
                  Restablecer valores
                </button>
              </div>
            </div>
          </div>

          <div className={styles.resultSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Resultado</h2>
              
              {nota !== null ? (
                <div className={styles.resultContent}>
                  <div className={styles.notaDisplay}>
                    <span className={styles.notaValue}>{nota}</span>
                    <span className={styles.notaLabel}>Nota</span>
                  </div>
                  
                  <div className={styles.resultDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Puntaje Obtenido:</span>
                      <span className={styles.detailValue}>{puntajeObtenido}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Puntaje Total:</span>
                      <span className={styles.detailValue}>{puntajeTotal}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Porcentaje:</span>
                      <span className={styles.detailValue}>
                        {(() => {
                          const obtenido = parseFloat(puntajeObtenido);
                          const total = parseFloat(puntajeTotal);
                          const tieneDecimales = !Number.isInteger(obtenido) || !Number.isInteger(total);
                          const decimales = tieneDecimales ? 2 : 1;
                          return ((obtenido / total) * 100).toFixed(decimales);
                        })()}%
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Estado:</span>
                      <span className={`${styles.detailValue} ${parseFloat(nota) >= 4.0 ? styles.aprobado : styles.reprobado}`}>
                        {parseFloat(nota) >= 4.0 ? 'Aprobado' : 'Reprobado'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <FontAwesomeIcon icon={faCalculator} className={styles.emptyIcon} />
                  <p className={styles.emptyText}>
                    Ingresa valores válidos para calcular tu nota
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
