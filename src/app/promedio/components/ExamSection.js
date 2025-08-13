"use client";

import { clamp, sanitizeIntegerInput, sanitizeDecimalInput, formatNumber } from "../utils";

export default function ExamSection({ examEvaluation, totals, updateEvaluation, removeEvaluation, passGradeThreshold }) {
  if (!examEvaluation) return null;
  return (
    <div className="mt-6 border-t pt-6">
      <div className="card p-5 sm:p-6" style={{ borderColor: 'var(--color-warning)', backgroundColor: '#fefbf3' }}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium flex items-center gap-2">
            <span>📝 Examen final</span>
            <span className="text-xs text-gray-500">(se recomienda agregarlo al final del semestre)</span>
          </h3>
          <button type="button" className="btn btn-ghost text-sm" onClick={() => removeEvaluation(examEvaluation.id)}>
            Eliminar examen
          </button>
        </div>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          El examen final representa el {examEvaluation.weightPercent}% de la nota final. 
          Las demás evaluaciones se re-escalan automáticamente para ocupar el {formatNumber(100 - (totals.examWeight || 0), 0)}% restante.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Porcentaje del examen (%)</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border rounded-md px-3 py-2"
              value={String(examEvaluation.weightPercent ?? '')}
              onChange={(e) => {
                const v = sanitizeIntegerInput(e.target.value);
                updateEvaluation(examEvaluation.id, { weightPercent: v });
              }}
              onBlur={(e) => {
                const num = Number(sanitizeIntegerInput(e.target.value));
                const clamped = clamp(isNaN(num) ? 30 : num, 0, 80);
                updateEvaluation(examEvaluation.id, { weightPercent: clamped });
              }}
              placeholder="ej: 30"
              title="El examen puede pesar entre 0% y 80%"
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Se re-escala el resto de evaluaciones al {formatNumber(Math.max(0, 100 - (Number(examEvaluation.weightPercent) || 0)), 0)}%
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Nota obtenida (1.0–7.0)</label>
            {(() => {
              const isInvalid = examEvaluation.grade !== "" && Number(examEvaluation.grade) > 0 && (Number(examEvaluation.grade) < 1 || Number(examEvaluation.grade) > 7);
              return (
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full border rounded-md px-3 py-2"
                  value={String(examEvaluation.grade ?? '')}
                  onChange={(e) => {
                    const v = sanitizeDecimalInput(e.target.value);
                    updateEvaluation(examEvaluation.id, { grade: v });
                  }}
                  onBlur={(e) => {
                    const raw = sanitizeDecimalInput(e.target.value);
                    if (raw === '' || Number(raw) === 0) return;
                    const num = Number(raw);
                    const fixed = clamp(isNaN(num) ? 0 : num, 1.0, 7.0);
                    updateEvaluation(examEvaluation.id, { grade: fixed });
                  }}
                  style={isInvalid ? { borderColor: 'var(--color-danger)' } : undefined}
                />
              );
            })()}
          </div>
        </div>

        {(() => {
          const examPending = !examEvaluation.grade || Number(examEvaluation.grade) < 1;
          const examEff = Number(totals.examWeight) || 0;
          if (!examPending || examEff <= 0) return null;
          const remainingForNonExam = Math.max(0, 100 - examEff);
          const nonExamAvg = Number(totals.nonExamAverage) || 0;
          const hasNonExamGraded = Number(totals.nonExamCount) > 0;
          const currentWithoutExam = hasNonExamGraded ? (nonExamAvg * remainingForNonExam) / 100 : 0;
          const needed = (passGradeThreshold - currentWithoutExam) / (examEff / 100);
          const clampedNeeded = clamp(needed, 1.0, 7.0);
          return (
            <div className="mt-3 p-2 bg-blue-50 rounded border">
              <p className="text-xs font-medium text-blue-800">Examen:</p>
              <p className="text-sm text-blue-700">
                {needed > 7.0
                  ? 'Con el examen solo no es posible aprobar.'
                  : `Necesitas ≈ nota ${formatNumber(clampedNeeded, 1)} en el examen para aprobar.`}
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}


