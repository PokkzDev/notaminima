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

export default function ClientPointsToGradePage() {
  const [achievedPoints, setAchievedPoints] = useState(42);
  const [totalPointsPreset, setTotalPointsPreset] = useState("60"); // "60" | "90" | "100" | "custom"
  const [totalPointsCustom, setTotalPointsCustom] = useState(60);
  const [exigenciaPercent, setExigenciaPercent] = useState(60);

  const totalPoints = useMemo(() => {
    return totalPointsPreset === "custom"
      ? Math.max(1, Number(totalPointsCustom) || 1)
      : Number(totalPointsPreset);
  }, [totalPointsPreset, totalPointsCustom]);

  const { percent, grade } = useMemo(() => {
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

    return { percent: pct, grade: computedGrade };
  }, [achievedPoints, totalPoints, exigenciaPercent]);

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
          Ingresa tus puntos y ajusta total y exigencia. Calculamos tu porcentaje y la nota en escala
          chilena 1.0–7.0.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <h2 className="text-base font-semibold">Entrada</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="achieved" className="text-sm font-medium">
                  Puntos obtenidos
                </label>
                <input
                  id="achieved"
                  type="number"
                  inputMode="decimal"
                  className="w-full border rounded-md px-3 py-2"
                  min={0}
                  max={totalPoints}
                  value={achievedPoints}
                  onChange={(e) => setAchievedPoints(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-medium">Total de puntos</span>
                <div className="flex flex-wrap gap-2">
                  {(["60", "90", "100", "custom"]) .map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`btn ${totalPointsPreset === opt ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setTotalPointsPreset(opt)}
                    >
                      {opt === "custom" ? "Personalizado" : opt}
                    </button>
                  ))}
                </div>
                {totalPointsPreset === "custom" && (
                  <input
                    type="number"
                    inputMode="numeric"
                    className="w-full border rounded-md px-3 py-2"
                    min={1}
                    value={totalPointsCustom}
                    onChange={(e) => setTotalPointsCustom(e.target.value)}
                  />
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="exigencia" className="text-sm font-medium">
                  Exigencia (% para nota 4.0)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="exigencia"
                    type="number"
                    className="w-28 border rounded-md px-3 py-2"
                    min={20}
                    max={95}
                    step={1}
                    value={exigenciaPercent}
                    onChange={(e) => setExigenciaPercent(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    {[60, 70].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setExigenciaPercent(preset)}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Con exigencia del {exigenciaPercent}% se obtiene nota 4.0.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="text-base font-semibold">Resultado</h2>
            <div className="mt-4">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {`${achievedPoints}/${totalPoints} pts = ${formatNumber(percent, 1)}%`}
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">
                Nota {formatNumber(grade, 1)}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
                Con exigencia {exigenciaPercent}%.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="card p-4">
                  <p className="text-sm font-medium">Escala</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    0% → 1.0 · {exigenciaPercent}% → 4.0 · 100% → 7.0
                  </p>
                </div>
                <div className="card p-4">
                  <p className="text-sm font-medium">Sugerencia</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Ajusta exigencia si tu curso usa 70% u otro valor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

