"use client";

import { useMemo } from "react";
import {
  normalizeEvaluations,
  computeTotals,
  computeNeededForPass,
  computeNeededForExemption,
  computeNextEvaluationRequirement,
  deriveStatus,
} from "../calculations";

export function useAverageData(evaluations, passGradeThreshold, exemptionThreshold) {
  const normalizedEvaluations = useMemo(
    () => normalizeEvaluations(evaluations),
    [evaluations]
  );

  const totals = useMemo(
    () => computeTotals(normalizedEvaluations),
    [normalizedEvaluations]
  );

  const neededForPass = useMemo(
    () => computeNeededForPass(totals, passGradeThreshold),
    [totals, passGradeThreshold]
  );

  const neededForExemption = useMemo(
    () => computeNeededForExemption(totals, exemptionThreshold),
    [totals, exemptionThreshold]
  );

  const nextEvaluationRequirement = useMemo(
    () => computeNextEvaluationRequirement(evaluations, passGradeThreshold),
    [evaluations, passGradeThreshold]
  );

  const status = useMemo(
    () => deriveStatus(totals, normalizedEvaluations, passGradeThreshold, exemptionThreshold),
    [totals, normalizedEvaluations, passGradeThreshold, exemptionThreshold]
  );

  const examEvaluation = useMemo(() => {
    return (
      normalizedEvaluations.find(
        (ev) => String(ev.name || "").trim().toLowerCase() === "examen"
      ) || null
    );
  }, [normalizedEvaluations]);

  const nonExamEvaluations = useMemo(() => {
    return normalizedEvaluations.filter(
      (ev) => String(ev.name || "").trim().toLowerCase() !== "examen"
    );
  }, [normalizedEvaluations]);

  return {
    normalizedEvaluations,
    totals,
    neededForPass,
    neededForExemption,
    nextEvaluationRequirement,
    status,
    examEvaluation,
    nonExamEvaluations,
  };
}


