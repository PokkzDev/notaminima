"use client";

import { clamp, sanitizeIntegerInput, sanitizeDecimalInput } from "../utils";

export default function AdvancedOptions({
  show,
  onToggle,
  hasEvaluations,
  exigenciaPercent,
  setExigenciaPercent,
  passGradeThreshold,
  setPassGradeThreshold,
  exemptionThreshold,
  setExemptionThreshold,
}) {
  if (!hasEvaluations) return null;
  return (
    <div className="mt-2">
      <button type="button" className="btn btn-ghost" onClick={onToggle}>
        Opciones avanzadas
      </button>
      {show && (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="card p-4">
            <p className="text-sm font-medium flex items-center gap-2">
              Exigencia (para 4.0)
              <span className="text-xs text-gray-400" title="Porcentaje necesario para 4.0 en la escala chilena">ℹ️</span>
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                className="w-28 border rounded-md px-3 py-2"
                value={String(exigenciaPercent ?? "")}
                onChange={(e) => {
                  const v = sanitizeIntegerInput(e.target.value);
                  setExigenciaPercent(v === "" ? "" : v);
                }}
                onBlur={(e) => {
                  const num = Number(sanitizeIntegerInput(e.target.value));
                  const clamped = clamp(isNaN(num) ? 60 : num, 20, 95);
                  setExigenciaPercent(clamped);
                }}
                placeholder="60"
                min="20"
                max="95"
              />
              <div className="flex flex-wrap gap-2">
                {[60, 65, 70].map((preset) => (
                  <button key={preset} type="button" className="btn btn-ghost text-xs" onClick={() => setExigenciaPercent(preset)}>
                    {preset}%
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
              Rango válido: 20% - 95%
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm font-medium flex items-center gap-2">
              Aprobación
              <span className="text-xs text-gray-400" title="Nota mínima para aprobar">ℹ️</span>
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="text"
                inputMode="decimal"
                className="w-28 border rounded-md px-3 py-2"
                value={String(passGradeThreshold ?? "")}
                onChange={(e) => {
                  const v = sanitizeDecimalInput(e.target.value);
                  setPassGradeThreshold(v === "" ? "" : v);
                }}
                onBlur={(e) => {
                  const num = Number(sanitizeDecimalInput(e.target.value));
                  const clamped = clamp(isNaN(num) ? 4.0 : num, 1.0, 7.0);
                  setPassGradeThreshold(clamped);
                }}
                placeholder="4.0"
                min="1.0"
                max="7.0"
                step="0.1"
              />
              <div className="flex flex-wrap gap-2">
                {[4.0, 4.5, 5.0].map((preset) => (
                  <button key={preset} type="button" className="btn btn-ghost text-xs" onClick={() => setPassGradeThreshold(preset)}>
                    {preset}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
              Rango válido: 1.0 - 7.0
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm font-medium flex items-center gap-2">
              Eximición (opcional)
              <span className="text-xs text-gray-400" title="Nota para eximirse del examen final">ℹ️</span>
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="text"
                inputMode="decimal"
                className="w-28 border rounded-md px-3 py-2"
                value={String(exemptionThreshold ?? "")}
                onChange={(e) => {
                  const v = sanitizeDecimalInput(e.target.value);
                  setExemptionThreshold(v === "" ? "" : v);
                }}
                onBlur={(e) => {
                  const num = Number(sanitizeDecimalInput(e.target.value));
                  const clamped = clamp(isNaN(num) ? 5.5 : num, 1.0, 7.0);
                  setExemptionThreshold(clamped);
                }}
                placeholder="5.5"
                min="1.0"
                max="7.0"
                step="0.1"
              />
              <div className="flex flex-wrap gap-2">
                {[5.5, 6.0].map((preset) => (
                  <button key={preset} type="button" className="btn btn-ghost text-xs" onClick={() => setExemptionThreshold(preset)}>
                    {preset}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
              Rango válido: 1.0 - 7.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


