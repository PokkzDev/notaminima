export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value, fractionDigits = 1) {
  return Number(value).toLocaleString("es-CL", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function sanitizeIntegerInput(value) {
  return String(value ?? "").replace(/[^0-9]/g, "");
}

export function sanitizeDecimalInput(value) {
  let v = String(value ?? "").replace(",", ".").replace(/[^0-9.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }
  return v;
}

export function createEmptyEvaluation() {
  return {
    id:
      globalThis.crypto && typeof globalThis.crypto.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : String(Date.now() + Math.random()),
    name: "Evaluación",
    date: "",
    weightPercent: 25,
    inputMode: "grade", // "grade" | "points"
    grade: 0.0,
    achievedPoints: 0,
    totalPoints: 60,
  };
}

export function createDefaultCourseData() {
  return {
    evaluations: [],
    exigenciaPercent: 60,
    passGradeThreshold: 4.0,
    exemptionThreshold: 5.5,
  };
}


