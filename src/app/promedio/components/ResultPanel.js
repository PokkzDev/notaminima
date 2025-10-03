"use client";

import { formatNumber, clamp } from "../utils";
import styles from "../Promedio.module.css";

export default function ResultPanel({
  totals,
  status,
  normalizedEvaluations,
  exemptionThreshold,
  passGradeThreshold,
  neededForPass,
  neededForExemption,
  nextEvaluationRequirement,
  exigenciaPercent,
}) {
  return (
    <div className={styles.resultsCard}>
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>
          Tu promedio actual
          {totals.currentAverage != null && (
            <span
              className={`${styles.resultStatus} ${status.label === 'Aprobado' ? styles.aprobado : styles.reprobado}`}
            >
              {status.label}
            </span>
          )}
        </h2>
      </div>

      <div className={styles.mainResult}>
        <div className={styles.resultValue}>
          {totals.currentAverage != null ? formatNumber(totals.currentAverage, 1) : "—"}
        </div>
        <div className={styles.resultLabel}>Promedio actual</div>
        <p className="text-sm mt-1 opacity-80">
          Progreso: {formatNumber(totals.completedWeight, 0)}% completado
        </p>
        {totals.completedWeight > 0 && totals.completedWeight < 100 && (
          <div className="mt-2 w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white/40 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(totals.completedWeight, 100)}%` }}
            />
          </div>
        )}
      </div>

      {(() => {
        const examEval = normalizedEvaluations.find(
          (ev) => String(ev.name || "").trim().toLowerCase() === "examen"
        );
        const examIsRendered = examEval && examEval.gradeValue != null;
        const hasExam = totals.hasExam;
        const remainingWeight = Math.max(0, 100 - totals.completedWeight);

        if (hasExam && examIsRendered) return null;
        if (remainingWeight === 0 && !hasExam) return null;

        const currentAvg = totals.currentAverage;
        const canExempt = currentAvg != null && currentAvg >= exemptionThreshold;
        const canPass = currentAvg != null && currentAvg >= passGradeThreshold;
        const mustTakeExam = canPass && !canExempt && hasExam;

        return (
          <div className="card p-4 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-blue-700">
              {mustTakeExam ? "📝 Estado de exención" : "🎯 Para poder rendir examen"}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              {(() => {
                const need = neededForPass;

                if (remainingWeight === 0) {
                  if (totals.currentAverage != null) {
                    if (totals.currentAverage >= exemptionThreshold) {
                      return "Ya te eximiste del examen 🎉";
                    }
                    if (totals.currentAverage >= passGradeThreshold) {
                      return "Debes rendir examen para aprobar 📝";
                    }
                    return "No alcanzas la nota mínima para aprobar ❌";
                  }
                  return "No quedan evaluaciones pendientes";
                }

                if (mustTakeExam) {
                  const needForExemption = neededForExemption;
                  if (
                    needForExemption != null &&
                    !isNaN(needForExemption) &&
                    needForExemption <= 7.0
                  ) {
                    return `Con tu promedio actual (${formatNumber(
                      currentAvg,
                      1
                    )}) debes rendir examen. Necesitas promedio ${formatNumber(
                      needForExemption,
                      1
                    )} en el ${formatNumber(remainingWeight, 0)}% restante para eximirte.`;
                  } else {
                    return `Con tu promedio actual (${formatNumber(
                      currentAvg,
                      1
                    )}) debes rendir examen. Ya no es posible eximirse con las evaluaciones restantes.`;
                  }
                }

                if (need == null || isNaN(need)) return "Agrega evaluaciones para ver qué necesitas";
                if (need > 7.0) return "No es posible aprobar con lo que queda ⚠️";
                if (need <= 1.0) return "Ya aseguras poder rendir examen 🎉";
                return `Promedio ${formatNumber(need, 1)} en el ${formatNumber(remainingWeight, 0)}% restante para poder rendir examen`;
              })()}
            </p>

            {nextEvaluationRequirement && nextEvaluationRequirement.gradeNeeded && (
              <div className="mt-3 p-2 bg-yellow-50 rounded border">
                <p className="text-xs font-medium text-yellow-800">Próxima evaluación:</p>
                <p className="text-sm text-yellow-700">
                  {nextEvaluationRequirement.name}: necesitas ≈ {formatNumber(nextEvaluationRequirement.gradeNeeded, 1)}
                </p>
              </div>
            )}

            {(() => {
              const examEval = normalizedEvaluations.find(
                (ev) => String(ev.name || "").trim().toLowerCase() === "examen"
              );
              const examIsRendered = examEval && examEval.gradeValue != null;
              const hasExam = totals.hasExam;
              const mustTakeExam =
                totals.currentAverage != null &&
                totals.currentAverage >= passGradeThreshold &&
                totals.currentAverage < exemptionThreshold &&
                hasExam;
              if (!(mustTakeExam && hasExam && !examIsRendered)) return null;

              const examEff = Number(totals.examWeight) || 0;
              if (examEff <= 0) return null;
              const remainingForNonExam = Math.max(0, 100 - examEff);
              const nonExamAvg = Number(totals.nonExamAverage) || 0;
              const hasNonExamGraded = Number(totals.nonExamCount) > 0;
              const currentWithoutExam = hasNonExamGraded
                ? (nonExamAvg * remainingForNonExam) / 100.0
                : 0;
              const needed =
                (passGradeThreshold - currentWithoutExam) / (examEff / 100.0);
              const clampedNeeded = clamp(needed, 1.0, 7.0);
              return (
                <div className="mt-3 p-2 bg-blue-50 rounded border">
                  <p className="text-xs font-medium text-blue-800">Examen:</p>
                  <p className="text-sm text-blue-700">
                    {needed > 7.0
                      ? "Con el examen solo no es posible aprobar."
                      : `Necesitas ≈ nota ${formatNumber(
                          clampedNeeded,
                          1
                        )} en el examen para aprobar.`}
                  </p>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {totals.completedWeight >= 100 &&
        totals.currentAverage != null &&
        totals.currentAverage >= exemptionThreshold && (
          <div className="card p-4 border-l-4 border-blue-500 bg-blue-50">
            <p className="text-sm font-medium text-blue-700">🎉 ¡Felicitaciones!</p>
            <p className="text-sm mt-1 text-blue-600">
              Has aprobado el curso y te eximiste del examen final
            </p>
          </div>
        )}

      {(() => {
        const examEval = normalizedEvaluations.find(
          (ev) => String(ev.name || "").trim().toLowerCase() === "examen"
        );
        const examIsRendered = examEval && examEval.gradeValue != null;
        const hasExam = totals.hasExam;

        if (
          totals.completedWeight >= 100 &&
          totals.currentAverage != null &&
          totals.currentAverage >= passGradeThreshold &&
          totals.currentAverage < exemptionThreshold &&
          (!hasExam || !examIsRendered)
        ) {
          return (
            <div className="card p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <p className="text-sm font-medium text-yellow-800">📝 Debes rendir examen</p>
              <p className="text-sm mt-1 text-yellow-700">
                Tu promedio de {formatNumber(totals.currentAverage, 1)} te permite rendir examen final para aprobar el curso
              </p>
              {hasExam && !examIsRendered && (() => {
                const examEff = Number(totals.examWeight) || 0;
                if (examEff <= 0) return null;
                const remainingForNonExam = Math.max(0, 100 - examEff);
                const nonExamAvg = Number(totals.nonExamAverage) || 0;
                const hasNonExamGraded = Number(totals.nonExamCount) > 0;
                const currentWithoutExam = hasNonExamGraded
                  ? (nonExamAvg * remainingForNonExam) / 100.0
                  : 0;
                const needed =
                  (passGradeThreshold - currentWithoutExam) / (examEff / 100.0);
                const clampedNeeded = clamp(needed, 1.0, 7.0);
                return (
                  <p className="text-sm mt-2 text-yellow-700">
                    {needed > 7.0
                      ? "Con el examen solo no es posible aprobar. Necesitas más que un 7.0."
                      : `Para aprobar necesitas aproximadamente nota ${formatNumber(
                          clampedNeeded,
                          1
                        )} en el examen final.`}
                  </p>
                );
              })()}
              {!hasExam && (
                <p className="text-xs mt-2" style={{ color: "#92400e" }}>
                  Agrega el examen final para calcular la nota mínima necesaria.
                </p>
              )}
            </div>
          );
        }
        return null;
      })()}

      {(() => {
        const examEval = normalizedEvaluations.find(
          (ev) => String(ev.name || "").trim().toLowerCase() === "examen"
        );
        const examIsRendered = examEval && examEval.gradeValue != null;
        const hasExam = totals.hasExam;

        if (hasExam && examIsRendered && totals.currentAverage != null) {
          if (totals.currentAverage >= exemptionThreshold) {
            return (
              <div className="card p-4 border-l-4 border-blue-500 bg-blue-50">
                <p className="text-sm font-medium text-blue-700">🎉 Curso Aprobado (Eximido)</p>
                <p className="text-sm mt-1 text-blue-600">
                  Promedio final: {formatNumber(totals.currentAverage, 1)} - Has aprobado con eximición del examen
                </p>
              </div>
            );
          } else if (totals.currentAverage >= passGradeThreshold) {
            return (
              <div className="card p-4 border-l-4 border-blue-500 bg-blue-50">
                <p className="text-sm font-medium text-blue-700">🎉 Curso Aprobado</p>
                <p className="text-sm mt-1 text-blue-600">
                  Promedio final: {formatNumber(totals.currentAverage, 1)} - Has aprobado el curso con el examen rendido
                </p>
              </div>
            );
          } else {
            return (
              <div className="card p-4 border-l-4 border-red-500 bg-red-50">
                <p className="text-sm font-medium text-red-700">❌ Curso Reprobado</p>
                <p className="text-sm mt-1 text-red-600">
                  Promedio final: {formatNumber(totals.currentAverage, 1)} - No alcanza la nota mínima de {formatNumber(passGradeThreshold, 1)} para aprobar
                </p>
              </div>
            );
          }
        }
        return null;
      })()}

      {totals.completedWeight >= 100 &&
        totals.currentAverage != null &&
        totals.currentAverage < passGradeThreshold &&
        (!totals.hasExam || !(normalizedEvaluations.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen")?.gradeValue != null)) && (
          <div className="card p-4 border-l-4 border-red-500 bg-red-50">
            <p className="text-sm font-medium text-red-700">❌ Reprobado</p>
            <p className="text-sm mt-1 text-red-600">
              Tu promedio de {formatNumber(totals.currentAverage, 1)} no alcanza la nota mínima para aprobar ({formatNumber(passGradeThreshold, 1)})
            </p>
          </div>
        )}

      {totals.remainingWeight > 0 && (
        <div className="text-center p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">
            Si te sacas 7.0 en todo lo que queda: <span className="font-medium">{formatNumber(totals.finalIfAllSevens, 1)}</span>
          </p>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Escala: {exigenciaPercent}% = 4.0 = 100% = 7.0
        </p>
      </div>
    </div>
  );
}