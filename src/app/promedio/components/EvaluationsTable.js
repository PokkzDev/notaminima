"use client";

import { clamp, sanitizeIntegerInput, sanitizeDecimalInput, formatNumber } from "../utils";
import { calculateTotalPercentage } from "../calculations";

export default function EvaluationsTable({
  evaluations,
  normalizedEvaluations,
  updateEvaluation,
  removeEvaluation,
}) {
  const hasExamInList = evaluations.some(
    (e) => String(e.name || "").toLowerCase().trim() === "examen"
  );

  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ color: "var(--color-text-muted)" }}>
            <th className="text-left font-medium py-2">Evaluación</th>
            <th className="text-left font-medium py-2">Porcentaje (%)</th>
            <th className="text-left font-medium py-2">Nota (1.0–7.0)</th>
            <th className="text-right font-medium py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {normalizedEvaluations
            .filter((ev) => String(ev.name || "").trim().toLowerCase() !== "examen")
            .map((ev) => {
              const isInvalid =
                ev.grade !== "" && Number(ev.grade) > 0 &&
                (Number(ev.grade) < 1 || Number(ev.grade) > 7);

              if (hasExamInList) {
                // No 100% restriction; simple clamping
                return (
                  <tr key={ev.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                    <td className="py-3 pr-3 min-w-[200px]">
                      <input
                        type="text"
                        className="w-full border rounded-md px-3 py-2"
                        value={ev.name}
                        onChange={(e) => updateEvaluation(ev.id, { name: e.target.value })}
                      />
                    </td>
                    <td className="py-3 pr-3 w-[140px]">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full border rounded-md px-3 py-2"
                        value={String(ev.weightPercent ?? "")}
                        onChange={(e) => {
                          const v = sanitizeIntegerInput(e.target.value);
                          updateEvaluation(ev.id, { weightPercent: v });
                        }}
                        onBlur={(e) => {
                          const raw = e.target.value;
                          const num = Number(sanitizeIntegerInput(raw));
                          const clamped = clamp(isNaN(num) ? 0 : num, 0, 100);
                          updateEvaluation(ev.id, { weightPercent: clamped });
                        }}
                        placeholder="ej: 30"
                        title="Se re-escala automáticamente con el examen"
                      />
                    </td>
                    <td className="py-3 pr-3 w-[160px]">
                      <input
                        type="text"
                        inputMode="decimal"
                        className="w-full border rounded-md px-3 py-2"
                        value={String(ev.grade ?? "")}
                        onChange={(e) => {
                          const v = sanitizeDecimalInput(e.target.value);
                          updateEvaluation(ev.id, { grade: v });
                        }}
                        onBlur={(e) => {
                          const raw = sanitizeDecimalInput(e.target.value);
                          if (raw === "" || Number(raw) === 0) return;
                          const num = Number(raw);
                          const fixed = clamp(isNaN(num) ? 0 : num, 1.0, 7.0);
                          updateEvaluation(ev.id, { grade: fixed });
                        }}
                        style={isInvalid ? { borderColor: "var(--color-danger)" } : undefined}
                      />
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" className="btn btn-ghost" onClick={() => removeEvaluation(ev.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              }

              // With 100% restriction logic
              const currentTotal = calculateTotalPercentage(evaluations, ev.id);
              const remaining = 100 - currentTotal;
              const currentValue = Number(ev.weightPercent) || 0;
              const maxPossible = currentValue + remaining;
              const isOverLimit = currentTotal + currentValue > 100;

              return (
                <tr key={ev.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="py-3 pr-3 min-w-[200px]">
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2"
                      value={ev.name}
                      onChange={(e) => updateEvaluation(ev.id, { name: e.target.value })}
                    />
                  </td>
                  <td className="py-3 pr-3 w-[140px]">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`w-full border rounded-md px-3 py-2 ${
                          isOverLimit ? "border-red-300 bg-red-50" : "border-gray-300"
                        }`}
                        value={String(ev.weightPercent ?? "")}
                        onChange={(e) => {
                          const v = sanitizeIntegerInput(e.target.value);
                          updateEvaluation(ev.id, { weightPercent: v });
                        }}
                        onBlur={(e) => {
                          const raw = e.target.value;
                          const num = Number(sanitizeIntegerInput(raw));
                          const clamped = clamp(isNaN(num) ? 0 : num, 0, maxPossible);
                          updateEvaluation(ev.id, { weightPercent: clamped });
                        }}
                        placeholder={remaining > 0 ? `Máx: ${Math.min(25, remaining)}` : "0"}
                        title={`Disponible: ${remaining}%`}
                      />
                      {remaining < 10 && remaining > 0 && (
                        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                          <span className="text-xs text-orange-500" title={`Solo quedan ${remaining}% disponibles`}>
                            {remaining}%
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-3 w-[160px]">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-full border rounded-md px-3 py-2"
                      value={String(ev.grade ?? "")}
                      onChange={(e) => {
                        const v = sanitizeDecimalInput(e.target.value);
                        updateEvaluation(ev.id, { grade: v });
                      }}
                      onBlur={(e) => {
                        const raw = sanitizeDecimalInput(e.target.value);
                        if (raw === "" || Number(raw) === 0) return;
                        const num = Number(raw);
                        const fixed = clamp(isNaN(num) ? 0 : num, 1.0, 7.0);
                        updateEvaluation(ev.id, { grade: fixed });
                      }}
                      style={isInvalid ? { borderColor: "var(--color-danger)" } : undefined}
                    />
                  </td>
                  <td className="py-3 text-right">
                    <button type="button" className="btn btn-ghost" onClick={() => removeEvaluation(ev.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}


