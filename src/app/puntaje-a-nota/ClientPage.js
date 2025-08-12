"use client";

import { useMemo, useState } from "react";

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
  const [achievedPoints, setAchievedPoints] = useState("42");
  const [totalPointsPreset, setTotalPointsPreset] = useState("60"); // "60" | "90" | "100" | "custom"
  const [totalPointsCustom, setTotalPointsCustom] = useState("60");
  const [exigenciaPercent, setExigenciaPercent] = useState("60");

  const totalPoints = useMemo(() => {
    return totalPointsPreset === "custom"
      ? Math.max(1, Number(totalPointsCustom) || 1)
      : Number(totalPointsPreset);
  }, [totalPointsPreset, totalPointsCustom]);

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
      gradeStatus = { label: "Aprobado", color: "#16a34a" };
    } else {
      gradeStatus = { label: "Reprobado", color: "#ef4444" };
    }

    return { percent: pct, grade: computedGrade, status: gradeStatus };
  }, [achievedPoints, totalPoints, exigenciaPercent]);

  // Quick examples for common scenarios
  const quickExamples = [
    { label: "Prueba 60 pts", achieved: "36", total: "60", exigencia: "60", description: "Prueba típica (60% exigencia)" },
    { label: "Certamen 100 pts", achieved: "70", total: "100", exigencia: "60", description: "Certamen universitario estándar" },
    { label: "Examen final", achieved: "63", total: "90", exigencia: "70", description: "Examen con 70% exigencia" },
    { label: "Caso límite", achieved: "36", total: "60", exigencia: "60", description: "Justo en la nota 4.0" },
  ];

  const applyExample = (example) => {
    setAchievedPoints(example.achieved);
    setTotalPointsPreset(example.total);
    setExigenciaPercent(example.exigencia);
  };

  return (
    <main>
      <section className="container py-12 sm:py-16">
        <div className="mb-3">
          <span className="kicker">Conversor de puntaje → nota</span>
        </div>
        <h1 className="text-3xl/[1.15] sm:text-4xl/[1.1] font-semibold tracking-tight">
          Puntaje a Nota (1.0–7.0)
        </h1>
        <p className="mt-3 max-w-[60ch] text-base" style={{ color: "var(--color-text-muted)" }}>
          Convierte puntaje a nota chilena. Ingresa puntos obtenidos, total y % de exigencia.
        </p>

        {/* Quick examples */}
        <div className="mt-8 card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">🚀 Ejemplos rápidos:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickExamples.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => applyExample(example)}
                  title={example.description}
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {/* Form */}
          <div className="order-2 lg:order-1 lg:col-span-2 card p-5 sm:p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Calculadora de Puntaje a Nota</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>🧮</span>
                  <span>Fácil y rápido</span>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Basic inputs */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="achieved" className="text-sm font-medium">
                      Puntos obtenidos
                    </label>
                    <input
                      id="achieved"
                      type="text"
                      inputMode="decimal"
                      className="w-full border rounded-md px-3 py-2 text-lg"
                      placeholder="ej: 42"
                      value={String(achievedPoints ?? '')}
                      onChange={(e) => {
                        const v = sanitizeDecimalInput(e.target.value);
                        setAchievedPoints(v);
                      }}
                      onBlur={(e) => {
                        const num = clamp(Number(sanitizeDecimalInput(e.target.value)) || 0, 0, totalPoints);
                        setAchievedPoints(String(num));
                      }}
                    />
                  </div>

                  <div className="grid gap-2">
                    <span className="text-sm font-medium">Total de puntos</span>
                    <div className="flex flex-wrap gap-2">
                      {(["50", "60", "70", "90", "100", "120", "custom"]).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`btn btn-sm ${totalPointsPreset === opt ? "btn-primary" : "btn-ghost"}`}
                          onClick={() => setTotalPointsPreset(opt)}
                        >
                          {opt === "custom" ? "Otro" : opt}
                        </button>
                      ))}
                    </div>
                    {totalPointsPreset === "custom" && (
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Ingresa total de puntos"
                        value={String(totalPointsCustom ?? '')}
                        onChange={(e) => {
                          const v = sanitizeIntegerInput(e.target.value);
                          setTotalPointsCustom(v);
                        }}
                        onBlur={(e) => {
                          const num = Math.max(1, Number(sanitizeIntegerInput(e.target.value)) || 1);
                          setTotalPointsCustom(String(num));
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Exigencia setting - always visible but simple by default */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="exigencia" className="text-sm font-medium">
                      Exigencia (% para nota 4.0)
                      <span className="ml-1 text-xs text-gray-500" title="Porcentaje mínimo para obtener nota 4.0">ℹ️</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="exigencia"
                        type="text"
                        inputMode="numeric"
                        className="w-28 border rounded-md px-3 py-2"
                        placeholder="60"
                        min="20"
                        max="95"
                        step="5"
                        value={String(exigenciaPercent ?? '')}
                        onChange={(e) => {
                          const v = sanitizeIntegerInput(e.target.value);
                          setExigenciaPercent(v);
                        }}
                        onBlur={(e) => {
                          const num = clamp(Number(sanitizeIntegerInput(e.target.value)) || 60, 20, 95);
                          setExigenciaPercent(String(num));
                        }}
                      />
                      <div className="flex flex-wrap gap-1">
                        {[50, 60, 70, 80].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            className={`btn btn-ghost text-xs ${Number(exigenciaPercent) === preset ? 'bg-blue-100' : ''}`}
                            onClick={() => setExigenciaPercent(preset)}
                          >
                            {preset}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      Común: 60% (estándar) · 70% (exigente) · Rango válido: 20% - 95%
                    </p>
                  </div>
                </div>
              </div>

              {/* Calculation summary */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Cálculo:</strong> {achievedPoints}/{totalPoints} pts = {formatNumber(percent, 1)}%</p>
                  <p><strong>Escala:</strong> 0% → 1.0 · {exigenciaPercent}% → 4.0 · 100% → 7.0</p>
                  <p><strong>Fórmula:</strong> {percent <= Number(exigenciaPercent) ? 
                    `1.0 + (${formatNumber(percent, 1)}% / ${exigenciaPercent}%) × 3.0` : 
                    `4.0 + ((${formatNumber(percent, 1)}% - ${exigenciaPercent}%) / ${100 - Number(exigenciaPercent)}%) × 3.0`}
                  </p>
                  {grade >= 6.5 && (
                    <p className="text-green-600"><strong>¡Excelente!</strong> Nota superior a 6.5</p>
                  )}
                  {grade >= 5.5 && grade < 6.5 && (
                    <p className="text-blue-600"><strong>Muy bueno!</strong> Nota entre 5.5 y 6.4</p>
                  )}
                  {grade < 3.0 && (
                    <p className="text-red-600"><strong>Nota muy baja.</strong> Considera revisar la materia.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results panel */}
          <div className="order-1 lg:order-2 card p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-base font-semibold flex items-center gap-2">
              Tu nota
              <span className="text-xs px-2 py-1 rounded-full" style={{ 
                backgroundColor: status.color + '20', 
                color: status.color,
                border: `1px solid ${status.color}40`
              }}>
                {status.label}
              </span>
            </h2>
            
            <div className="mt-4 grid gap-4">
              {/* Main grade display */}
              <div className="text-center">
                <p className="text-4xl font-semibold tracking-tight">
                  {formatNumber(grade, 1)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Nota final
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Porcentaje:</span>
                  <span className="font-medium">{formatNumber(percent, 1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Exigencia:</span>
                  <span className="font-medium">{exigenciaPercent}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className="font-medium" style={{ color: status.color }}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Status card */}
              {grade >= 4.0 ? (
                <div className="card p-4 border-l-4 border-green-500 bg-green-50">
                  <p className="text-sm font-medium text-green-700">🎉 ¡Aprobado!</p>
                  <p className="text-sm text-green-600 mt-1">
                    Tu nota {formatNumber(grade, 1)} supera el mínimo de 4.0
                  </p>
                </div>
              ) : (
                (() => {
                  const pointsNeededToPass = Math.ceil(totalPoints * (Number(exigenciaPercent) / 100));
                  const pointsStillNeeded = Math.max(0, pointsNeededToPass - Number(achievedPoints));
                  
                  return (
                    <div className="card p-4 border-l-4 border-red-500 bg-red-50">
                      <p className="text-sm font-medium text-red-700">❌ Reprobado</p>
                      <p className="text-sm text-red-600 mt-1">
                        Necesitas {pointsStillNeeded} puntos más para aprobar ({pointsNeededToPass} pts total para nota 4.0)
                      </p>
                    </div>
                  );
                })()
              )}

              {/* Reference scale */}
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-700">📊 Escala de referencia</p>
                <div className="text-xs text-blue-600 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>0% ({0} pts)</span>
                    <span>→ 1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{exigenciaPercent}% ({Math.round(totalPoints * Number(exigenciaPercent) / 100)} pts)</span>
                    <span>→ 4.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>100% ({totalPoints} pts)</span>
                    <span>→ 7.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

