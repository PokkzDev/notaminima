'use client';

import { useState } from 'react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faSearch } from '@fortawesome/free-solid-svg-icons';
import AdSense from '../components/AdSense';
import styles from './EscalaNotas.module.css';

export default function EscalaDeNotas() {
  const [puntajeTotal, setPuntajeTotal] = useState('');
  const [exigencia, setExigencia] = useState('60');
  const [paso, setPaso] = useState('1');
  const [tablaGenerada, setTablaGenerada] = useState(false);
  const [datosTabla, setDatosTabla] = useState([]);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const calcularNota = (puntaje, total, exig) => {
    const puntajeMinimo = total * (exig / 100);
    
    let notaCalculada;
    if (puntaje >= puntajeMinimo) {
      notaCalculada = 4.0 + 3.0 * ((puntaje - puntajeMinimo) / (total - puntajeMinimo));
    } else {
      notaCalculada = 1.0 + 3.0 * (puntaje / puntajeMinimo);
    }
    
    notaCalculada = Math.max(1.0, Math.min(7.0, notaCalculada));
    
    // Determinar decimales según el paso
    const pasoNum = parseFloat(paso);
    let decimales;
    if (pasoNum === 0.25) {
      decimales = 2;
    } else if (pasoNum === 0.5) {
      decimales = 1;
    } else {
      decimales = 1;
    }
    
    return notaCalculada.toFixed(decimales);
  };

  const generarTabla = () => {
    const total = parseFloat(puntajeTotal);
    const exig = parseFloat(exigencia);
    const pasoNum = parseFloat(paso);

    // Validaciones
    if (!puntajeTotal || isNaN(total) || total <= 0) {
      setError('Por favor ingresa un puntaje total válido mayor a 0');
      setTablaGenerada(false);
      return;
    }

    if (isNaN(exig) || exig <= 0 || exig > 100) {
      setError('La exigencia debe estar entre 1% y 100%');
      setTablaGenerada(false);
      return;
    }

    if (isNaN(pasoNum) || (pasoNum !== 1 && pasoNum !== 0.5 && pasoNum !== 0.25)) {
      setError('El paso debe ser 1, 0.5 o 0.25');
      setTablaGenerada(false);
      return;
    }

    setError('');
    
    // Generar datos de la tabla
    const datos = [];
    let puntaje = 0;
    
    while (puntaje <= total) {
      const porcentaje = (puntaje / total) * 100;
      const nota = calcularNota(puntaje, total, exig);
      const esAprobado = parseFloat(nota) >= 4.0;
      
      datos.push({
        puntaje: puntaje,
        porcentaje: porcentaje,
        nota: nota,
        esAprobado: esAprobado
      });
      
      puntaje += pasoNum;
      
      // Evitar problemas de precisión de punto flotante
      puntaje = Math.round(puntaje * 100) / 100;
    }

    // Asegurar que el último valor sea exactamente el total
    if (datos.length > 0 && datos[datos.length - 1].puntaje < total) {
      const porcentaje = 100;
      const nota = calcularNota(total, total, exig);
      const esAprobado = parseFloat(nota) >= 4.0;
      
      datos.push({
        puntaje: total,
        porcentaje: porcentaje,
        nota: nota,
        esAprobado: esAprobado
      });
    }

    setDatosTabla(datos);
    setTablaGenerada(true);
  };

  const organizarDatosEnFilas = (datos, columnasPorFila = 8) => {
    const filas = [];
    for (let i = 0; i < datos.length; i += columnasPorFila) {
      filas.push(datos.slice(i, i + columnasPorFila));
    }
    return filas;
  };

  const filtrarDatos = (datos) => {
    if (!busqueda.trim()) {
      return datos;
    }
    
    const busquedaLower = busqueda.toLowerCase().trim();
    return datos.filter(item => {
      const puntajeStr = formatearPuntaje(item.puntaje).toLowerCase();
      const notaStr = item.nota.toLowerCase();
      const porcentajeStr = item.porcentaje.toFixed(1).toLowerCase();
      
      return puntajeStr.includes(busquedaLower) || 
             notaStr.includes(busquedaLower) || 
             porcentajeStr.includes(busquedaLower);
    });
  };

  const formatearPuntaje = (valor) => {
    const pasoNum = parseFloat(paso);
    if (pasoNum === 0.25) {
      return valor.toFixed(2);
    } else if (pasoNum === 0.5) {
      return valor.toFixed(1);
    } else {
      return valor.toFixed(0);
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Escala de Notas Chile',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CLP',
    },
    description: 'Genera una tabla completa de conversión de puntajes a notas según el sistema educativo chileno en escala 1.0-7.0.',
    url: 'https://notaminima.cl/escala-de-notas',
    featureList: [
      'Generación de tabla de conversión',
      'Personalización de puntaje máximo',
      'Ajuste de paso de incremento',
      'Ajuste de porcentaje de exigencia',
      'Exportación a CSV',
    ],
  };

  return (
    <>
      <Script
        id="json-ld-escala"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerIcon}>
              <FontAwesomeIcon icon={faTable} />
            </div>
            <h1 className={styles.title}>Escala de Notas</h1>
            <p className={styles.subtitle}>
              Genera una tabla completa de conversión de puntajes a notas según el sistema chileno
            </p>
          </header>

          <div className={styles.adContainer}>
            <AdSense adSlot="" adFormat="auto" />
          </div>

          <div className={styles.content}>
            <div className={styles.formSection}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Configuración</h2>
                
                <div className={styles.formGroup}>
                  <label htmlFor="puntajeTotal" className={styles.label}>
                    Puntaje Total (Máximo)
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

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Paso de Incremento
                  </label>
                  <div className={styles.stepSelector}>
                    <button
                      type="button"
                      className={`${styles.stepButton} ${paso === '1' ? styles.stepButtonActive : ''}`}
                      onClick={() => setPaso('1')}
                    >
                      1 punto
                    </button>
                    <button
                      type="button"
                      className={`${styles.stepButton} ${paso === '0.5' ? styles.stepButtonActive : ''}`}
                      onClick={() => setPaso('0.5')}
                    >
                      0.5 puntos
                    </button>
                    <button
                      type="button"
                      className={`${styles.stepButton} ${paso === '0.25' ? styles.stepButtonActive : ''}`}
                      onClick={() => setPaso('0.25')}
                    >
                      0.25 puntos
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <div className={styles.buttonGroup}>
                  <button 
                    onClick={generarTabla} 
                    className={styles.generateButton}
                  >
                    Generar Tabla
                  </button>
                </div>
              </div>
            </div>

            {tablaGenerada && datosTabla.length > 0 && (
              <div className={styles.tableSection}>
                <div className={styles.card}>
                  <div className={styles.tableHeader}>
                    <h2 className={styles.cardTitle}>
                      Tabla de Conversión
                    </h2>
                    <div className={styles.searchContainer}>
                      <div className={styles.searchWrapper}>
                        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                        <input
                          type="text"
                          className={styles.searchInput}
                          placeholder="Buscar por puntaje, nota o porcentaje..."
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {busqueda && (
                    <div className={styles.searchResults}>
                      Mostrando {filtrarDatos(datosTabla).length} de {datosTabla.length} resultados
                    </div>
                  )}
                  
                  <div className={styles.tableWrapper}>
                    <table className={styles.conversionTable}>
                      <thead>
                        <tr>
                          {Array.from({ length: 8 }, (_, i) => (
                            <th key={i} className={styles.thColumn}>
                              <div className={styles.headerCell}>
                                <span className={styles.headerLabel}>Puntaje</span>
                                <span className={styles.headerLabel}>Nota</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {organizarDatosEnFilas(filtrarDatos(datosTabla), 8).map((fila, filaIndex) => (
                          <tr 
                            key={filaIndex}
                            className={`${styles.tableRow} ${filaIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}`}
                          >
                            {fila.map((item, colIndex) => (
                              <td 
                                key={colIndex}
                                className={`${styles.tableCell} ${item.esAprobado ? styles.rowAprobada : styles.rowReprobada}`}
                              >
                                <div className={styles.cellData}>
                                  <span className={item.esAprobado ? styles.puntajeAprobado : styles.puntajeReprobado}>
                                    {formatearPuntaje(item.puntaje)}
                                  </span>
                                  <span className={`${styles.notaCell} ${item.esAprobado ? styles.notaAprobada : styles.notaReprobada}`}>
                                    {item.nota}
                                  </span>
                                </div>
                              </td>
                            ))}
                            {/* Rellenar celdas vacías si la fila no tiene 8 columnas */}
                            {Array.from({ length: 8 - fila.length }, (_, i) => (
                              <td key={`empty-${i}`} className={styles.tableCellEmpty}></td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

