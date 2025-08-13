import { clamp } from "./utils";

export function normalizeEvaluations(evaluations) {
  return (evaluations || []).map((evaluation) => {
    const weight = clamp(Number(evaluation.weightPercent) || 0, 0, 100);
    const rawGrade = Number(evaluation.grade);
    const gradeValue = !rawGrade || rawGrade < 1 ? null : clamp(rawGrade, 1.0, 7.0);
    return { ...evaluation, weightPercent: weight, gradeValue };
  });
}

export function computeTotals(normalizedEvaluations) {
  const safeEvaluations = Array.isArray(normalizedEvaluations)
    ? normalizedEvaluations
    : [];

  const examIndex = safeEvaluations.findIndex(
    (ev) => String(ev.name || "").trim().toLowerCase() === "examen"
  );
  const hasExam = examIndex !== -1;
  const examWeight = hasExam
    ? Number(safeEvaluations[examIndex].weightPercent) || 0
    : 0;

  const nonExam = safeEvaluations.filter((_, idx) => idx !== examIndex);
  const nonExamRawTotal = nonExam.reduce(
    (acc, ev) => acc + (Number(ev.weightPercent) || 0),
    0
  );

  if (hasExam) {
    const remainingWeight = Math.max(0, 100 - examWeight);

    let nonExamSum = 0;
    let nonExamCount = 0;
    nonExam.forEach((ev) => {
      if (ev.gradeValue != null) {
        nonExamSum += ev.gradeValue;
        nonExamCount += 1;
      }
    });
    const nonExamAverage = nonExamCount > 0 ? nonExamSum / nonExamCount : 0;

    let weightedSum = 0;
    let completedWeight = 0;

    if (nonExamCount > 0) {
      weightedSum += (nonExamAverage * remainingWeight) / 100;
      completedWeight += remainingWeight;
    }

    const examEv = safeEvaluations[examIndex];
    if (examEv.gradeValue != null) {
      weightedSum += (examEv.gradeValue * examWeight) / 100;
      completedWeight += examWeight;
    }

    const currentAverage =
      completedWeight > 0 ? weightedSum / (completedWeight / 100) : null;
    const remainingWeightFinal = Math.max(0, 100 - completedWeight);
    const finalIfAllSevens = weightedSum + (7.0 * remainingWeightFinal) / 100;

    const effectiveWeights = new Map();
    safeEvaluations.forEach((ev) => {
      effectiveWeights.set(ev.id, Number(ev.weightPercent) || 0);
    });

    return {
      effectiveWeights,
      warningWeight: nonExamRawTotal,
      completedWeight,
      weightedSum,
      currentAverage,
      remainingWeight: remainingWeightFinal,
      finalIfAllSevens,
      hasExam,
      examWeight,
      nonExamRawTotal,
      nonExamAverage,
      nonExamCount,
    };
  }

  // Without exam
  const effectiveWeights = new Map();
  safeEvaluations.forEach((ev) => {
    effectiveWeights.set(ev.id, Number(ev.weightPercent) || 0);
  });

  let completedWeight = 0;
  let weightedSum = 0;
  safeEvaluations.forEach((ev) => {
    const weight = Number(ev.weightPercent) || 0;
    if (ev.gradeValue != null) {
      completedWeight += weight;
      weightedSum += (ev.gradeValue * weight) / 100;
    }
  });

  const currentAverage =
    completedWeight > 0 ? weightedSum / (completedWeight / 100) : null;
  const remainingWeight = Math.max(0, 100 - completedWeight);
  const finalIfAllSevens = weightedSum + (7.0 * remainingWeight) / 100;
  const warningWeight = safeEvaluations.reduce(
    (acc, ev) => acc + (Number(ev.weightPercent) || 0),
    0
  );

  return {
    effectiveWeights,
    warningWeight,
    completedWeight,
    weightedSum,
    currentAverage,
    remainingWeight,
    finalIfAllSevens,
    hasExam,
    examWeight,
    nonExamRawTotal,
  };
}

export function computeNeededForPass(totals, passGradeThreshold) {
  const remainingWeight = Math.max(0, 100 - (totals?.completedWeight || 0));
  if (remainingWeight === 0) return null;
  const target = Number(passGradeThreshold) || 4.0;
  const currentContribution = Number(totals?.weightedSum) || 0;
  const needed = (target - currentContribution) / (remainingWeight / 100);
  return clamp(needed, 1.0, 7.0);
}

export function computeNeededForExemption(totals, exemptionThreshold) {
  const remainingWeight = Math.max(0, 100 - (totals?.completedWeight || 0));
  if (remainingWeight === 0) return null;
  const target = Number(exemptionThreshold) || 5.5;
  const currentContribution = Number(totals?.weightedSum) || 0;
  const needed = (target - currentContribution) / (remainingWeight / 100);
  return clamp(needed, 1.0, 7.0);
}

export function computeNextEvaluationRequirement(evaluations, passGradeThreshold) {
  const safeEvs = Array.isArray(evaluations) ? evaluations : [];
  const pendingIndex = safeEvs.findIndex(
    (ev) => !ev.grade || Number(ev.grade) < 1
  );
  if (pendingIndex === -1) return null;

  const target = Number(passGradeThreshold) || 4.0;
  const prepared = safeEvs.map((ev) => ({
    grade: ev.grade,
    weight: clamp(Number(ev.weightPercent) || 0, 0, 100),
    name: ev.name || "Evaluación",
  }));

  const next = prepared[pendingIndex];
  const nextWeight = next.weight;
  if (nextWeight <= 0) return { name: next.name, gradeNeeded: null };

  let currentSum = 0;
  prepared.forEach((ev, idx) => {
    if (idx === pendingIndex) return;
    const g = !ev.grade || Number(ev.grade) < 1 ? null : clamp(Number(ev.grade) || 0, 1.0, 7.0);
    if (g != null) currentSum += (g * ev.weight) / 100;
  });

  const restWeight = Math.max(
    0,
    100 -
      nextWeight -
      prepared.reduce(
        (acc, ev, idx) =>
          acc + (idx !== pendingIndex && ev.grade != null && Number(ev.grade) >= 1 ? ev.weight : 0),
        0
      )
  );
  const optimisticFuture = 7.0;
  const futureContribution = (optimisticFuture * restWeight) / 100;
  const requiredNext = (target - currentSum - futureContribution) / (nextWeight / 100);
  const gradeNeeded = clamp(requiredNext, 1.0, 7.0);
  return { name: next.name, gradeNeeded };
}

export function calculateTotalPercentage(evaluations, excludeId = null) {
  const safeEvs = Array.isArray(evaluations) ? evaluations : [];
  return safeEvs.reduce((total, ev) => {
    if (excludeId && ev.id === excludeId) return total;
    return total + (Number(ev.weightPercent) || 0);
  }, 0);
}

export function getCourseSummary(course) {
  const normalizedEvs = (course?.evaluations || []).map((ev) => {
    const weight = clamp(Number(ev.weightPercent) || 0, 0, 100);
    const raw = Number(ev.grade);
    const gradeValue = !raw || raw < 1 ? null : clamp(raw, 1.0, 7.0);
    return { ...ev, weightPercent: weight, gradeValue };
  });

  const examIndex = normalizedEvs.findIndex(
    (ev) => String(ev.name || "").trim().toLowerCase() === "examen"
  );
  const hasExam = examIndex !== -1;
  const examWeight = hasExam
    ? Number(normalizedEvs[examIndex].weightPercent) || 0
    : 0;
  const nonExam = normalizedEvs.filter((_, idx) => idx !== examIndex);

  let completedWeight = 0;
  let weightedSum = 0;
  let currentAverage = null;

  if (hasExam) {
    const remainingWeight = Math.max(0, 100 - examWeight);
    let nonExamSum = 0;
    let nonExamCount = 0;
    nonExam.forEach((ev) => {
      if (ev.gradeValue != null) {
        nonExamSum += ev.gradeValue;
        nonExamCount += 1;
      }
    });
    const nonExamAverage = nonExamCount > 0 ? nonExamSum / nonExamCount : 0;
    if (nonExamCount > 0) {
      weightedSum += (nonExamAverage * remainingWeight) / 100;
      completedWeight += remainingWeight;
    }
    const examEv = normalizedEvs[examIndex];
    if (examEv.gradeValue != null) {
      weightedSum += (examEv.gradeValue * examWeight) / 100;
      completedWeight += examWeight;
    }
    currentAverage =
      completedWeight > 0 ? weightedSum / (completedWeight / 100) : null;
  } else {
    normalizedEvs.forEach((ev) => {
      const weight = Number(ev.weightPercent) || 0;
      if (ev.gradeValue != null) {
        completedWeight += weight;
        weightedSum += (ev.gradeValue * weight) / 100;
      }
    });
    currentAverage =
      completedWeight > 0 ? weightedSum / (completedWeight / 100) : null;
  }

  let status = { label: "Sin evaluar", color: "#64748b" };
  if (completedWeight > 0 && weightedSum >= 0) {
    const passThreshold = course?.passGradeThreshold ?? 4.0;
    const exemptionThreshold = course?.exemptionThreshold ?? 5.5;
    const examEval = normalizedEvs.find(
      (ev) => String(ev.name || "").trim().toLowerCase() === "examen"
    );
    const examIsRendered = examEval && examEval.gradeValue != null;
    const isFinalState = Math.round(completedWeight) >= 100 || (hasExam && examIsRendered);
    if (isFinalState) {
      if (currentAverage >= exemptionThreshold) {
        status = { label: "Aprobado (eximido)", color: "#16a34a" };
      } else if (currentAverage >= passThreshold) {
        if (hasExam && examIsRendered) {
          status = { label: "Aprobado", color: "#16a34a" };
        } else {
          status = { label: "Debe rendir examen", color: "#f59e0b" };
        }
      } else {
        status = { label: "Reprobado", color: "#ef4444" };
      }
    } else {
      if (currentAverage != null) {
        if (currentAverage >= exemptionThreshold) {
          status = { label: "Eximición posible", color: "#0ea5e9" };
        } else if (currentAverage >= passThreshold) {
          status = { label: "Vas aprobando", color: "#16a34a" };
        } else {
          status = { label: "Bajo aprobación", color: "#f59e0b" };
        }
      }
    }
  }

  const totalEvaluations = normalizedEvs.length;
  const completedEvaluations = normalizedEvs.filter((ev) => ev.gradeValue != null).length;

  let requiredInfo = null;
  const passThreshold = course?.passGradeThreshold ?? 4.0;
  const exemptionThreshold = course?.exemptionThreshold ?? 5.5;
  const remainingWeight = Math.max(0, 100 - completedWeight);
  if (remainingWeight > 0) {
    const needForPass = (passThreshold - weightedSum) / (remainingWeight / 100);
    const needForExemption = (exemptionThreshold - weightedSum) / (remainingWeight / 100);
    if (!isNaN(needForExemption) && needForExemption <= 7.0) {
      requiredInfo = {
        avgNeeded: clamp(needForExemption, 1.0, 7.0),
        remainingWeight,
        purpose: "para eximirte",
      };
    } else if (!isNaN(needForPass) && needForPass <= 7.0) {
      requiredInfo = {
        avgNeeded: clamp(needForPass, 1.0, 7.0),
        remainingWeight,
        purpose: "para aprobar",
      };
    }
  }

  return {
    accumulatedScore: weightedSum,
    completedWeight,
    totalEvaluations,
    completedEvaluations,
    currentAverage,
    status,
    requiredInfo,
  };
}

// Optional: keep these available for future point-based UI
export function pointsToGrade(achieved, total, exigencia) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const safeAchieved = clamp(Number(achieved) || 0, 0, safeTotal);
  const pct = (safeAchieved / safeTotal) * 100;
  const ex = clamp(Number(exigencia) || 60, 20, 95);
  let grade;
  if (pct <= ex) {
    grade = 1.0 + (pct / ex) * 3.0;
  } else {
    grade = 4.0 + ((pct - ex) / (100 - ex)) * 3.0;
  }
  return clamp(grade, 1.0, 7.0);
}

export function gradeToPercent(grade, exigencia) {
  const g = clamp(Number(grade) || 0, 1.0, 7.0);
  const ex = clamp(Number(exigencia) || 60, 20, 95);
  if (g <= 4.0) {
    return ((g - 1.0) / 3.0) * ex;
  }
  return ex + ((g - 4.0) / 3.0) * (100 - ex);
}

export function deriveStatus(totals, normalizedEvaluations, passGradeThreshold, exemptionThreshold) {
  if (!totals || totals.currentAverage == null) return { label: "Incompleto", color: "#64748b" };

  const examEval = Array.isArray(normalizedEvaluations)
    ? normalizedEvaluations.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen")
    : null;
  const examIsRendered = examEval && examEval.gradeValue != null;
  const hasExam = !!totals.hasExam;

  const isFinalState = Math.round(totals.completedWeight) >= 100 || (hasExam && examIsRendered);

  if (isFinalState) {
    if (totals.currentAverage >= (exemptionThreshold ?? 5.5)) {
      return { label: "Aprobado (eximido)", color: "#16a34a" };
    }
    if (totals.currentAverage >= (passGradeThreshold ?? 4.0)) {
      if (hasExam && examIsRendered) {
        return { label: "Aprobado", color: "#16a34a" };
      }
      return { label: "Debe rendir examen", color: "#f59e0b" };
    }
    return { label: "Reprobado", color: "#ef4444" };
  }

  if (totals.currentAverage >= (exemptionThreshold ?? 5.5)) return { label: "Eximición posible", color: "#0ea5e9" };
  if (totals.currentAverage >= (passGradeThreshold ?? 4.0)) {
    if (hasExam && totals.currentAverage < (exemptionThreshold ?? 5.5)) {
      return { label: "Debes rendir examen", color: "#f59e0b" };
    }
    return { label: "Vas aprobando", color: "#16a34a" };
  }
  return { label: "Bajo aprobación", color: "#f59e0b" };
}


