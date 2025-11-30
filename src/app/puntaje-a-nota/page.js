'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faRotateRight, faPercent, faTrophy, faBullseye } from '@fortawesome/free-solid-svg-icons';
import styles from './PuntajeNota.module.css';

export default function PuntajeANota() {
  const [puntajeObtenido, setPuntajeObtenido] = useState('60');
  const [puntajeTotal, setPuntajeTotal] = useState('100');
  const [exigencia, setExigencia] = useState('60');
  const [nota, setNota] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
    const obtenido = Number.parseFloat(puntajeObtenido);
    const total = Number.parseFloat(puntajeTotal);
    const exig = Number.parseFloat(exigencia);

    if (Number.isNaN(obtenido) || Number.isNaN(total) || Number.isNaN(exig)) {
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
      notaCalculada = 4 + 3 * ((obtenido - puntajeMinimo) / (total - puntajeMinimo));
    } else {
      notaCalculada = 1 + 3 * (obtenido / puntajeMinimo);
    }

    notaCalculada = Math.max(1, Math.min(7, notaCalculada));
    
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

  const getNotaCategoria = (notaValue) => {
    const notaNum = Number.parseFloat(notaValue);
    if (notaNum >= 6.0) return 'excelente';
    if (notaNum >= 5.0) return 'muyBueno';
    if (notaNum >= 4.0) return 'aprobado';
    return 'reprobado';
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Conversor Puntaje a Nota Chile',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CLP',
    },
    description: 'Convierte puntajes de evaluaciones a notas según el sistema educativo chileno en escala 1.0-7.0.',
    url: 'https://notaminima.cl/puntaje-a-nota',
    featureList: [
      'Conversión de puntaje a nota',
      'Ajuste de porcentaje de exigencia',
      'Soporte para decimales',
      'Cálculo instantáneo',
    ],
  };

  return (
    <>
      <Script
        id="json-ld-puntaje"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faCalculator} />
          </div>
          <h1 className={styles.title}>Puntaje a Nota</h1>
          <p className={styles.subtitle}>
            Convierte tus puntajes de evaluaciones a notas según el sistema chileno
          </p>
        </header>

        <div className={styles.content}>
          <div className={styles.calculatorGrid}>
            {/* Input Section */}
            <div className={styles.inputSection}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <FontAwesomeIcon icon={faTrophy} className={styles.cardIcon} />
                  Puntaje
                </h2>
                <div className={styles.inputGroup}>
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
                      placeholder="Ej: 60"
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
                      placeholder="Ej: 100"
                    />
                  </div>
                </div>

                {/* Progress bar */}
                {puntajeObtenido && puntajeTotal && Number(puntajeTotal) > 0 && (
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                      <div 
                        className={`${styles.progressFill} ${Number(nota) >= 4 ? styles.progressAprobado : styles.progressReprobado}`}
                        style={{ width: `${Math.min(100, (Number(puntajeObtenido) / Number(puntajeTotal)) * 100)}%` }}
                      />
                      <div 
                        className={styles.progressMarker}
                        style={{ left: `${exigencia}%` }}
                        title={`Exigencia: ${exigencia}%`}
                      />
                    </div>
                    <div className={styles.progressLabels}>
                      <span>0%</span>
                      <span className={styles.progressPercentage}>
                        {((Number(puntajeObtenido) / Number(puntajeTotal)) * 100).toFixed(1)}%
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <FontAwesomeIcon icon={faBullseye} className={styles.cardIcon} />
                  Exigencia
                </h2>
                <div className={styles.exigenciaGroup}>
                  <div className={styles.formGroup}>
                    <label htmlFor="exigencia" className={styles.label}>
                      Porcentaje de exigencia
                    </label>
                    <div className={styles.inputWithIcon}>
                      <input
                        type="number"
                        id="exigencia"
                        className={styles.input}
                        value={exigencia}
                        onChange={(e) => setExigencia(e.target.value)}
                        min="1"
                        max="100"
                        step="1"
                        placeholder="60"
                      />
                      <span className={styles.inputIcon}>
                        <FontAwesomeIcon icon={faPercent} />
                      </span>
                    </div>
                  </div>
                  <div className={styles.presets}>
                    <span className={styles.presetsLabel}>Presets:</span>
                    {[50, 60, 70].map((value) => (
                      <button
                        key={value}
                        className={`${styles.presetButton} ${Number(exigencia) === value ? styles.presetActive : ''}`}
                        onClick={() => setExigencia(String(value))}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <button 
                onClick={limpiarFormulario} 
                className={styles.resetButton}
              >
                <FontAwesomeIcon icon={faRotateRight} />
                Restablecer valores
              </button>
            </div>

            {/* Result Section */}
            <div className={styles.resultSection}>
              <div className={`${styles.resultCard} ${nota !== null ? styles[`result${getNotaCategoria(nota).charAt(0).toUpperCase() + getNotaCategoria(nota).slice(1)}`] : ''}`}>
                <span className={styles.resultLabel}>Tu nota</span>
                {nota === null ? (
                  <span className={styles.notaPlaceholder}>—</span>
                ) : (
                  <>
                    <span className={`${styles.notaValue} ${styles[`nota${getNotaCategoria(nota).charAt(0).toUpperCase() + getNotaCategoria(nota).slice(1)}`]}`}>
                      {nota}
                    </span>
                    <span className={`${styles.notaStatus} ${styles[`status${getNotaCategoria(nota).charAt(0).toUpperCase() + getNotaCategoria(nota).slice(1)}`]}`}>
                      {Number.parseFloat(nota) >= 6.0 ? 'Excelente' : Number.parseFloat(nota) >= 5.0 ? 'Muy Bueno' : Number.parseFloat(nota) >= 4.0 ? 'Aprobado' : 'Reprobado'}
                    </span>
                  </>
                )}
              </div>

              {nota !== null && (
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{puntajeObtenido}/{puntajeTotal}</span>
                    <span className={styles.statLabel}>Puntaje</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {((Number(puntajeObtenido) / Number(puntajeTotal)) * 100).toFixed(1)}%
                    </span>
                    <span className={styles.statLabel}>Porcentaje</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {Math.ceil(Number(puntajeTotal) * (Number(exigencia) / 100))}
                    </span>
                    <span className={styles.statLabel}>Mínimo para 4.0</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}
