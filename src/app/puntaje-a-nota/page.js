'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faRotateRight, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import AdSense from '../components/AdSense';
import Link from 'next/link';
import styles from './PuntajeNota.module.css';

export default function PuntajeANota() {
  const [puntajeObtenido, setPuntajeObtenido] = useState('60');
  const [puntajeTotal, setPuntajeTotal] = useState('100');
  const [exigencia, setExigencia] = useState('60');
  const [nota, setNota] = useState(null);
  const [error, setError] = useState('');
  const [infoExpandida, setInfoExpandida] = useState(false);
  const [ejemploExpandido, setEjemploExpandido] = useState(false);
  const [tipsExpandidos, setTipsExpandidos] = useState(false);


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

        <div className={styles.adContainer}>
          <AdSense adSlot="" adFormat="auto" />
        </div>

        {/* Sección Informativa */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <button 
              className={styles.infoHeader}
              onClick={() => setInfoExpandida(!infoExpandida)}
              aria-expanded={infoExpandida}
            >
              <h2 className={styles.infoTitle}>Sistema de Evaluación Chileno</h2>
              <FontAwesomeIcon 
                icon={infoExpandida ? faChevronUp : faChevronDown} 
                className={styles.chevronIcon}
              />
            </button>
            {infoExpandida && (
              <div className={styles.infoContent}>
                <p className={styles.infoText}>
                  En Chile, el sistema educativo utiliza una escala de notas del 1.0 al 7.0, donde 4.0 es la nota mínima de aprobación. 
                  Las evaluaciones normalmente se califican mediante puntajes que luego se convierten a esta escala. El proceso de conversión 
                  considera el porcentaje de exigencia, que es el puntaje mínimo necesario para aprobar (típicamente entre 50% y 70%). 
                  Si obtienes un puntaje igual o superior al mínimo requerido, tu nota se calculará entre 4.0 y 7.0. Si obtienes menos 
                  del mínimo, tu nota estará entre 1.0 y 3.9. Esta herramienta te permite convertir rápidamente cualquier puntaje a su 
                  equivalente en la escala chilena, ayudándote a entender tu rendimiento académico de manera más clara y precisa.
                </p>
              </div>
            )}
          </div>

          <div className={styles.exampleCard}>
            <button 
              className={styles.infoHeader}
              onClick={() => setEjemploExpandido(!ejemploExpandido)}
              aria-expanded={ejemploExpandido}
            >
              <h3 className={styles.exampleTitle}>Ejemplo Práctico Paso a Paso</h3>
              <FontAwesomeIcon 
                icon={ejemploExpandido ? faChevronUp : faChevronDown} 
                className={styles.chevronIcon}
              />
            </button>
            {ejemploExpandido && (
              <div className={styles.infoContent}>
                <p className={styles.exampleText}>
                  Supongamos que tienes una evaluación de Matemáticas con los siguientes datos:
                </p>
                <ol className={styles.exampleList}>
                  <li><strong>Puntaje obtenido:</strong> Obtuviste 75 puntos de un total de 100 puntos.</li>
                  <li><strong>Puntaje total:</strong> La evaluación tenía un máximo de 100 puntos.</li>
                  <li><strong>Exigencia:</strong> Tu institución requiere 60% para aprobar, es decir, necesitas al menos 60 puntos.</li>
                  <li><strong>Cálculo:</strong> Como obtuviste 75 puntos (más del mínimo de 60), tu nota se calcula entre 4.0 y 7.0. 
                  La fórmula es: Nota = 4.0 + 3.0 × ((75 - 60) / (100 - 60)) = 4.0 + 3.0 × (15/40) = 4.0 + 1.125 = <strong>5.125</strong></li>
                </ol>
                <p className={styles.exampleText}>
                  Para usar esta calculadora, simplemente ingresa estos valores en los campos correspondientes y obtendrás tu nota 
                  instantáneamente, junto con el porcentaje obtenido y el estado (Aprobado o Reprobado).
                </p>
              </div>
            )}
          </div>

          <div className={styles.tipsCard}>
            <button 
              className={styles.infoHeader}
              onClick={() => setTipsExpandidos(!tipsExpandidos)}
              aria-expanded={tipsExpandidos}
            >
              <h3 className={styles.tipsTitle}>Tips y Consejos de Uso</h3>
              <FontAwesomeIcon 
                icon={tipsExpandidos ? faChevronUp : faChevronDown} 
                className={styles.chevronIcon}
              />
            </button>
            {tipsExpandidos && (
              <div className={styles.infoContent}>
                <ul className={styles.tipsList}>
                  <li><strong>Verifica el porcentaje de exigencia:</strong> Cada institución puede tener diferentes porcentajes de exigencia. Asegúrate de usar el valor correcto (generalmente entre 50% y 70%).</li>
                  <li><strong>Usa decimales cuando sea necesario:</strong> Si tu evaluación tiene puntajes con decimales (por ejemplo, 82.5 puntos), puedes ingresarlos directamente.</li>
                  <li><strong>Planifica tus evaluaciones:</strong> Usa esta herramienta antes de rendir una evaluación para saber qué puntaje necesitas obtener para alcanzar una nota específica.</li>
                  <li><strong>Comprende el resultado:</strong> El resultado muestra tu nota en escala 1.0-7.0, tu porcentaje obtenido y si aprobaste o no la evaluación.</li>
                </ul>
              </div>
            )}
          </div>

          <div className={styles.helpCard}>
            <Link href="/ayuda" className={styles.helpLink}>
              ¿Necesitas más ayuda? Visita nuestra guía completa sobre cómo convertir puntajes a notas →
            </Link>
          </div>
        </div>

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
    </>
  );
}
