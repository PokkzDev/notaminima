'use client';

import { useState, useCallback } from 'react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faSearch, faSlidersH, faPercent, faListOl, faFilePdf, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './EscalaNotas.module.css';

// Helper function to generate initial table data
function generarDatosIniciales() {
  const total = 100;
  const exig = 60;
  const pasoNum = 1;
  
  const calcNota = (puntaje) => {
    const puntajeMinimo = total * (exig / 100);
    let notaCalculada;
    if (puntaje >= puntajeMinimo) {
      notaCalculada = 4 + 3 * ((puntaje - puntajeMinimo) / (total - puntajeMinimo));
    } else {
      notaCalculada = 1 + 3 * (puntaje / puntajeMinimo);
    }
    return Math.max(1, Math.min(7, notaCalculada)).toFixed(1);
  };
  
  const datos = [];
  let puntaje = 0;
  
  while (puntaje <= total) {
    const porcentaje = (puntaje / total) * 100;
    const nota = calcNota(puntaje);
    datos.push({
      puntaje,
      porcentaje,
      nota,
      esAprobado: Number.parseFloat(nota) >= 4
    });
    puntaje += pasoNum;
  }
  
  return datos;
}

export default function EscalaDeNotas() {
  const [puntajeTotal, setPuntajeTotal] = useState('100');
  const [exigencia, setExigencia] = useState('60');
  const [paso, setPaso] = useState('1');
  const [tablaGenerada, setTablaGenerada] = useState(true);
  const [datosTabla, setDatosTabla] = useState(generarDatosIniciales);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const calcularNota = useCallback((puntaje, total, exig, pasoActual) => {
    const puntajeMinimo = total * (exig / 100);
    
    let notaCalculada;
    if (puntaje >= puntajeMinimo) {
      notaCalculada = 4 + 3 * ((puntaje - puntajeMinimo) / (total - puntajeMinimo));
    } else {
      notaCalculada = 1 + 3 * (puntaje / puntajeMinimo);
    }
    
    notaCalculada = Math.max(1, Math.min(7, notaCalculada));
    
    // Determinar decimales según el paso
    const pasoNum = Number.parseFloat(pasoActual);
    let decimales;
    if (pasoNum === 0.25) {
      decimales = 2;
    } else if (pasoNum === 0.5) {
      decimales = 1;
    } else {
      decimales = 1;
    }
    
    return notaCalculada.toFixed(decimales);
  }, []);

  const generarTabla = useCallback(() => {
    const total = Number.parseFloat(puntajeTotal);
    const exig = Number.parseFloat(exigencia);
    const pasoNum = Number.parseFloat(paso);

    // Validaciones
    if (!puntajeTotal || Number.isNaN(total) || total <= 0) {
      setError('Por favor ingresa un puntaje total válido mayor a 0');
      setTablaGenerada(false);
      return;
    }

    if (Number.isNaN(exig) || exig <= 0 || exig > 100) {
      setError('La exigencia debe estar entre 1% y 100%');
      setTablaGenerada(false);
      return;
    }

    if (Number.isNaN(pasoNum) || (pasoNum !== 1 && pasoNum !== 0.5 && pasoNum !== 0.25)) {
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
      const nota = calcularNota(puntaje, total, exig, pasoNum);
      const esAprobado = Number.parseFloat(nota) >= 4;
      
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
    if (datos.length > 0 && datos.at(-1).puntaje < total) {
      const porcentaje = 100;
      const nota = calcularNota(total, total, exig, pasoNum);
      const esAprobado = Number.parseFloat(nota) >= 4;
      
      datos.push({
        puntaje: total,
        porcentaje: porcentaje,
        nota: nota,
        esAprobado: esAprobado
      });
    }

    setDatosTabla(datos);
    setTablaGenerada(true);
  }, [puntajeTotal, exigencia, paso, calcularNota]);

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
    const pasoNum = Number.parseFloat(paso);
    if (pasoNum === 0.25) {
      return valor.toFixed(2);
    } else if (pasoNum === 0.5) {
      return valor.toFixed(1);
    } else {
      return valor.toFixed(0);
    }
  };

  const exportarCSV = () => {
    if (!datosTabla.length) return;
    
    const headers = ['Puntaje', 'Porcentaje', 'Nota', 'Estado'];
    const rows = datosTabla.map(item => [
      formatearPuntaje(item.puntaje),
      item.porcentaje.toFixed(1) + '%',
      item.nota,
      item.esAprobado ? 'Aprobado' : 'Reprobado'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `escala_notas_${puntajeTotal}pts_${exigencia}pct.csv`;
    link.click();
  };

  const exportarPDF = () => {
    if (!datosTabla.length) return;
    
    const puntajeMinimo = Math.ceil(Number(puntajeTotal) * (Number(exigencia) / 100));
    
    // Create print-friendly HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Escala de Notas - ${puntajeTotal} puntos</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px;
            color: #1a1a1a;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
          }
          .header h1 { 
            font-size: 24px; 
            margin-bottom: 8px;
          }
          .header p { 
            font-size: 14px; 
            color: #555;
          }
          .info-grid {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
          }
          .info-item {
            text-align: center;
          }
          .info-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            font-size: 11px;
          }
          th { 
            background: #333; 
            color: white; 
            padding: 8px 4px;
            font-weight: 600;
            text-align: center;
          }
          td { 
            border: 1px solid #ddd; 
            padding: 6px 4px;
            text-align: center;
          }
          tr:nth-child(even) { background: #f9f9f9; }
          .aprobado { color: #059669; font-weight: 600; }
          .reprobado { color: #dc2626; font-weight: 600; }
          .footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 11px;
            color: #666;
            text-align: center;
          }
          .nota-cell { font-weight: bold; }
          @media print {
            body { padding: 10px; }
            .info-grid { background: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { background: #333 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .aprobado { color: #059669 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .reprobado { color: #dc2626 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Escala de Notas</h1>
          <p>Tabla de conversión de puntajes generada con NotaMinima.cl</p>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Puntaje Total</div>
            <div class="info-value">${puntajeTotal} pts</div>
          </div>
          <div class="info-item">
            <div class="info-label">Exigencia</div>
            <div class="info-value">${exigencia}%</div>
          </div>
          <div class="info-item">
            <div class="info-label">Mínimo para aprobar</div>
            <div class="info-value">${puntajeMinimo} pts</div>
          </div>
          <div class="info-item">
            <div class="info-label">Incremento</div>
            <div class="info-value">${paso === '1' ? '1 punto' : paso + ' puntos'}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Puntaje</th>
              <th>%</th>
              <th>Nota</th>
              <th>Puntaje</th>
              <th>%</th>
              <th>Nota</th>
              <th>Puntaje</th>
              <th>%</th>
              <th>Nota</th>
              <th>Puntaje</th>
              <th>%</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            ${(() => {
              const rows = [];
              const cols = 4;
              const rowCount = Math.ceil(datosTabla.length / cols);
              
              for (let i = 0; i < rowCount; i++) {
                let row = '<tr>';
                for (let j = 0; j < cols; j++) {
                  const idx = i + j * rowCount;
                  if (idx < datosTabla.length) {
                    const item = datosTabla[idx];
                    const clase = item.esAprobado ? 'aprobado' : 'reprobado';
                    row += `
                      <td>${formatearPuntaje(item.puntaje)}</td>
                      <td>${item.porcentaje.toFixed(0)}%</td>
                      <td class="nota-cell ${clase}">${item.nota}</td>
                    `;
                  } else {
                    row += '<td></td><td></td><td></td>';
                  }
                }
                row += '</tr>';
                rows.push(row);
              }
              return rows.join('');
            })()}
          </tbody>
        </table>

        <div class="footer">
          <p>Generado el ${new Date().toLocaleDateString('es-CL')} • NotaMinima.cl - Calculadora de notas chilena</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Give browser time to render, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const getResumenTabla = () => {
    if (!datosTabla.length) return null;
    
    const aprobados = datosTabla.filter(d => d.esAprobado).length;
    const reprobados = datosTabla.length - aprobados;
    const puntajeMinimo = Math.ceil(Number(puntajeTotal) * (Number(exigencia) / 100));
    
    return { aprobados, reprobados, puntajeMinimo, total: datosTabla.length };
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

          <div className={styles.content}>
            <div className={styles.configGrid}>
              {/* Configuration Section */}
              <div className={styles.configSection}>
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <FontAwesomeIcon icon={faListOl} className={styles.cardIcon} />
                    Puntaje
                  </h2>
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
                      step="1"
                      placeholder="Ej: 100"
                    />
                  </div>

                  <fieldset className={styles.formGroup}>
                    <legend className={styles.label}>
                      Paso de Incremento
                    </legend>
                    <div className={styles.stepSelector}>
                      {[
                        { value: '1', label: '1 punto' },
                        { value: '0.5', label: '0.5 puntos' },
                        { value: '0.25', label: '0.25 puntos' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`${styles.stepButton} ${paso === option.value ? styles.stepButtonActive : ''}`}
                          onClick={() => setPaso(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <FontAwesomeIcon icon={faSlidersH} className={styles.cardIcon} />
                    Exigencia
                  </h2>
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

                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <button 
                  onClick={generarTabla} 
                  className={styles.generateButton}
                >
                  <FontAwesomeIcon icon={faTable} />
                  Generar Tabla
                </button>
              </div>

              {/* Summary Section */}
              <div className={styles.summarySection}>
                {tablaGenerada && getResumenTabla() ? (
                  <>
                    <div className={styles.summaryCard}>
                      <span className={styles.summaryLabel}>Configuración</span>
                      <div className={styles.summaryMain}>
                        <span className={styles.summaryValue}>{puntajeTotal}</span>
                        <span className={styles.summaryUnit}>puntos</span>
                      </div>
                      <span className={styles.summaryDetail}>Exigencia: {exigencia}%</span>
                    </div>

                    <div className={styles.statsRow}>
                      <div className={styles.statCard}>
                        <FontAwesomeIcon icon={faCheckCircle} className={styles.statIconAprobado} />
                        <span className={styles.statNumber}>{getResumenTabla().aprobados}</span>
                        <span className={styles.statLabel}>Aprobados</span>
                      </div>
                      <div className={styles.statCard}>
                        <FontAwesomeIcon icon={faTimesCircle} className={styles.statIconReprobado} />
                        <span className={styles.statNumber}>{getResumenTabla().reprobados}</span>
                        <span className={styles.statLabel}>Reprobados</span>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <span className={styles.infoLabel}>Puntaje mínimo para aprobar</span>
                      <span className={styles.infoValue}>{getResumenTabla().puntajeMinimo} pts</span>
                    </div>

                    <button onClick={exportarPDF} className={styles.exportButton}>
                      <FontAwesomeIcon icon={faFilePdf} />
                      Exportar PDF
                    </button>
                  </>
                ) : (
                  <div className={styles.emptyState}>
                    <FontAwesomeIcon icon={faTable} className={styles.emptyIcon} />
                    <p className={styles.emptyText}>Configura los parámetros y genera la tabla para ver el resumen</p>
                  </div>
                )}
              </div>
            </div>

            {tablaGenerada && datosTabla.length > 0 && (
              <div className={styles.tableSection}>
                <div className={styles.card}>
                  <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>
                      Tabla de Conversión
                    </h2>
                    <div className={styles.searchContainer}>
                      <div className={styles.searchWrapper}>
                        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                        <input
                          type="text"
                          className={styles.searchInput}
                          placeholder="Buscar puntaje o nota..."
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
                          {Array.from({ length: 10 }, (_, i) => (
                            <th key={i} className={styles.thColumn}>
                              <span className={styles.headerLabel}>Pts → Nota</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {organizarDatosEnFilas(filtrarDatos(datosTabla), 10).map((fila, filaIndex) => (
                          <tr 
                            key={`row-${fila[0]?.puntaje ?? filaIndex}`}
                            className={`${styles.tableRow} ${filaIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}`}
                          >
                            {fila.map((item) => (
                              <td 
                                key={`cell-${item.puntaje}`}
                                className={`${styles.tableCell} ${item.esAprobado ? styles.rowAprobada : styles.rowReprobada}`}
                              >
                                <div className={styles.cellData}>
                                  <span className={styles.puntajeValue}>
                                    {formatearPuntaje(item.puntaje)}
                                  </span>
                                  <span className={styles.separator}>→</span>
                                  <span className={`${styles.notaValue} ${item.esAprobado ? styles.notaAprobada : styles.notaReprobada}`}>
                                    {item.nota}
                                  </span>
                                </div>
                              </td>
                            ))}
                            {/* Rellenar celdas vacías si la fila no tiene 10 columnas */}
                            {Array.from({ length: 10 - fila.length }, (_, i) => (
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

