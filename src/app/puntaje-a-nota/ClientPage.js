"use client";

import { useMemo, useState } from "react";
import styles from "./PuntajeNota.module.css";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value, fractionDigits = 1) {
  return Number(value).toLocaleString("es-CL", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function sanitizeIntegerInput(value) {
  return String(value ?? '').replace(/[^0-9]/g, '');
}

function sanitizeDecimalInput(value) {
  let v = String(value ?? '').replace(',', '.').replace(/[^0-9.]/g, '');
  const firstDot = v.indexOf('.');
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
  }
  return v;
}

export default function ClientPointsToGradePage() {
  const [achievedPoints, setAchievedPoints] = useState("60");
  const [totalPoints, setTotalPoints] = useState("100");
  const [exigenciaPercent, setExigenciaPercent] = useState(60);

  const { percent, grade, status } = useMemo(() => {
    const safeTotal = Math.max(1, Number(totalPoints) || 1);
    const safeAchieved = clamp(Number(achievedPoints) || 0, 0, safeTotal);
    const pct = (safeAchieved / safeTotal) * 100;
    const ex = clamp(Number(exigenciaPercent) || 60, 20, 95);

    let computedGrade;
    if (pct <= ex) {
      computedGrade = 1.0 + (pct / ex) * 3.0; // 0% -> 1.0, ex% -> 4.0
    } else {
      computedGrade = 4.0 + ((pct - ex) / (100 - ex)) * 3.0; // ex% -> 4.0, 100% -> 7.0
    }
    computedGrade = clamp(computedGrade, 1.0, 7.0);

    // Determine status
    let gradeStatus;
    if (computedGrade >= 4.0) {
      gradeStatus = { label: "Aprobado", color: "#2563eb" };
    } else {
      gradeStatus = { label: "Reprobado", color: "#ef4444" };
    }

    return {
      percent: pct,
      grade: computedGrade,
      status: gradeStatus
    };
  }, [achievedPoints, totalPoints, exigenciaPercent]);


  return (
    <main>
      <section className={styles.container}>
        <div className="py-16 sm:py-20 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Conversor de Puntaje a Nota</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convierte fácilmente cualquier puntaje a la escala chilena 1.0-7.0
            </p>
          </div>

          {/* Calculator */}
          <div className={styles.calculatorGrid}>
            {/* Input Section */}
            <div className={styles.inputSection}>
              <h2>Ingresa tus datos</h2>

              <div className={styles.inputGroup}>
                {/* Puntos obtenidos y total - horizontal */}
                <div className={styles.scoreInputsRow}>
                  <div className={styles.scoreInputGroup}>
                    <label htmlFor="achieved" className="block text-sm font-medium text-gray-700 mb-2">
                      Puntos obtenidos
                    </label>
                    <input
                      id="achieved"
                      type="number"
                      className={styles.inputField}
                      placeholder="60"
                      value={achievedPoints}
                      onChange={(e) => {
                        const value = sanitizeDecimalInput(e.target.value);
                        setAchievedPoints(value);
                      }}
                      onBlur={(e) => {
                        const num = Math.max(0, Number(sanitizeDecimalInput(e.target.value)) || 0);
                        setAchievedPoints(String(num));
                      }}
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div className={styles.scoreInputGroup}>
                    <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-2">
                      Total de puntos
                    </label>
                    <input
                      id="total"
                      type="number"
                      className={styles.inputField}
                      placeholder="100"
                      value={totalPoints}
                      onChange={(e) => {
                        const value = sanitizeIntegerInput(e.target.value);
                        setTotalPoints(value);
                      }}
                      onBlur={(e) => {
                        const num = Math.max(1, Number(sanitizeIntegerInput(e.target.value)) || 1);
                        setTotalPoints(String(num));
                      }}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                {/* Exigencia */}
                <div>
                  <label htmlFor="exigencia" className="block text-sm font-medium text-gray-700 mb-2">
                    Exigencia para aprobar (4.0) - %
                  </label>
                  <input
                    id="exigencia"
                    type="number"
                    className={styles.inputField}
                    placeholder="60"
                    value={exigenciaPercent || ''}
                    onChange={(e) => {
                      const value = Number(sanitizeIntegerInput(e.target.value)) || 60;
                      setExigenciaPercent(value);
                    }}
                    onBlur={(e) => {
                      const num = clamp(Number(sanitizeIntegerInput(e.target.value)) || 60, 20, 95);
                      setExigenciaPercent(num);
                    }}
                    min="20"
                    max="95"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rango: 20% - 95% (60% es el estándar)
                  </p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className={styles.resultsSection}>
              <h2>Tu resultado</h2>

              {/* Main Result */}
              <div className={styles.mainResult}>
                <div className={styles.resultNumber}>
                  {formatNumber(grade, 1)}
                </div>
                <div className={styles.resultLabel}>Nota final</div>

                {/* Status Badge */}
                <div className={`${styles.statusBadge} ${status.label === 'Aprobado' ? styles.aprobado : styles.reprobado}`}>
                  {status.label}
                </div>
              </div>

              {/* Details */}
              <div className={styles.detailsGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Porcentaje obtenido:</span>
                  <span className={styles.detailValue}>{formatNumber(percent, 1)}%</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Exigencia:</span>
                  <span className={styles.detailValue}>{exigenciaPercent}%</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Puntuación:</span>
                  <span className={styles.detailValue}>
                    {achievedPoints}/{totalPoints} pts
                  </span>
                </div>
              </div>

              {/* Status Message */}
              {grade >= 4.0 ? (
                <div className={`${styles.statusCard} ${styles.aprobado}`}>
                  <div className="statusTitle">¡Aprobado!</div>
                  <div className="statusMessage">
                    Tu nota {formatNumber(grade, 1)} es suficiente para aprobar
                  </div>
                </div>
              ) : (
                <div className={`${styles.statusCard} ${styles.reprobado}`}>
                  <div className="statusTitle">Reprobado</div>
                  <div className="statusMessage">
                    Necesitas nota 4.0 o superior para aprobar
                  </div>
                </div>
              )}

              {/* Quick Reference */}
              <div className={styles.referenceCard}>
                <div className="referenceTitle">Escala de referencia:</div>
                <div className="referenceList">
                  <div className="referenceItem">1.0-3.9: Reprobado</div>
                  <div className="referenceItem">4.0-4.9: Aprobado</div>
                  <div className="referenceItem">5.0-5.9: Bueno</div>
                  <div className="referenceItem">6.0-6.9: Muy Bueno</div>
                  <div className="referenceItem">7.0: Excelente</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

