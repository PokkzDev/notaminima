"use client";

import { formatNumber } from "../utils";
import { calculateTotalPercentage } from "../calculations";
import styles from "../Promedio.module.css";

export default function PercentageFeedback({
  examEvaluation,
  nonExamEvaluations,
  evaluations,
}) {
  if (!(nonExamEvaluations.length > 0 || examEvaluation)) return null;

  if (examEvaluation) {
    const examWeight = Number(examEvaluation.weightPercent) || 0;
    const remainingForNonExam = 100 - examWeight;
    return (
      <div className={`${styles.percentageFeedback} ${styles.percentageFeedback.success}`}>
        <p className="text-sm flex items-center gap-2">
          <span>📝</span>
          Con examen: Examen {formatNumber(examWeight, 0)}% + Evaluaciones {formatNumber(remainingForNonExam, 0)}%
        </p>
        <p className="text-xs mt-1">
          Las evaluaciones se re-escalan automáticamente al {formatNumber(remainingForNonExam, 0)}% disponible
        </p>
      </div>
    );
  }

  const currentTotal = calculateTotalPercentage(evaluations);
  const remaining = 100 - currentTotal;
  if (currentTotal === 100) {
    return (
      <div className={`${styles.percentageFeedback} ${styles.percentageFeedback.success}`}>
        <p className="text-sm flex items-center gap-2">
          <span>✅</span>
          Porcentajes: {formatNumber(currentTotal, 0)}% - ¡Perfecto!
        </p>
      </div>
    );
  }
  if (currentTotal > 100) {
    return (
      <div className={`${styles.percentageFeedback} ${styles.percentageFeedback.error}`}>
        <p className="text-sm flex items-center gap-2">
          <span>⚠️</span>
          Porcentajes: {formatNumber(currentTotal, 0)}% - Excede el 100% por {formatNumber(currentTotal - 100, 0)}%
        </p>
        <p className="text-xs mt-1">Ajusta los porcentajes para que sumen exactamente 100%</p>
      </div>
    );
  }
  if (remaining > 0) {
    return (
      <div className={`${styles.percentageFeedback} ${styles.percentageFeedback.warning}`}>
        <p className="text-sm flex items-center gap-2">
          <span>📊</span>
          Porcentajes: {formatNumber(currentTotal, 0)}% - Faltan {formatNumber(remaining, 0)}%
        </p>
        <p className="text-xs mt-1">
          Tienes {formatNumber(remaining, 0)}% disponible para distribuir
        </p>
      </div>
    );
  }
  return null;
}


