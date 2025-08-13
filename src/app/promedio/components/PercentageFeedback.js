"use client";

import { formatNumber } from "../utils";
import { calculateTotalPercentage } from "../calculations";

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
      <div className="card p-3 border-blue-200 bg-blue-50">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <span>📝</span>
          Con examen: Examen {formatNumber(examWeight, 0)}% + Evaluaciones {formatNumber(remainingForNonExam, 0)}%
        </p>
        <p className="text-xs mt-1 text-blue-600">
          Las evaluaciones se re-escalan automáticamente al {formatNumber(remainingForNonExam, 0)}% disponible
        </p>
      </div>
    );
  }

  const currentTotal = calculateTotalPercentage(evaluations);
  const remaining = 100 - currentTotal;
  if (currentTotal === 100) {
    return (
      <div className="card p-3 border-green-200 bg-green-50">
        <p className="text-sm text-green-700 flex items-center gap-2">
          <span>✅</span>
          Porcentajes: {formatNumber(currentTotal, 0)}% - ¡Perfecto!
        </p>
      </div>
    );
  }
  if (currentTotal > 100) {
    return (
      <div className="card p-3 border-red-200 bg-red-50">
        <p className="text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span>
          Porcentajes: {formatNumber(currentTotal, 0)}% - Excede el 100% por {formatNumber(currentTotal - 100, 0)}%
        </p>
        <p className="text-xs mt-1 text-red-600">Ajusta los porcentajes para que sumen exactamente 100%</p>
      </div>
    );
  }
  if (remaining > 0) {
    return (
      <div className="card p-3 border-yellow-200 bg-yellow-50">
        <p className="text-sm text-yellow-700 flex items-center gap-2">
          <span>📊</span>
          Porcentajes: {formatNumber(currentTotal, 0)}% - Faltan {formatNumber(remaining, 0)}%
        </p>
        <p className="text-xs mt-1 text-yellow-600">
          Tienes {formatNumber(remaining, 0)}% disponible para distribuir
        </p>
      </div>
    );
  }
  return null;
}


