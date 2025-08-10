"use client";

import { useEffect, useMemo, useState } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value, fractionDigits = 1) {
  return Number(value).toLocaleString("es-CL", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function createEmptyEvaluation() {
  return {
    id: (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
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

export default function ClientAverageCalculatorPage() {
  // Course management
  const createDefaultCourseData = () => ({
    evaluations: [],
    exigenciaPercent: 60,
    passGradeThreshold: 4.0,
    exemptionThreshold: 5.5,
  });

  const [courses, setCourses] = useState([]); // {id, name, evaluations, exigenciaPercent, passGradeThreshold, exemptionThreshold}[]
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Local editing state mirrors the selected course
  const [evaluations, setEvaluations] = useState([]);
  const [exigenciaPercent, setExigenciaPercent] = useState(60);
  const [passGradeThreshold, setPassGradeThreshold] = useState(4.0);
  const [exemptionThreshold, setExemptionThreshold] = useState(5.5);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate multi-course storage with migration from single-course storage
  useEffect(() => {
    try {
      const rawV2 = localStorage.getItem("nm.courses.v1");
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        const loadedCourses = Array.isArray(parsed.courses) ? parsed.courses : [];
        const selected = parsed.selectedCourseId && loadedCourses.find(c => c.id === parsed.selectedCourseId)
          ? parsed.selectedCourseId
          : (loadedCourses[0]?.id || "");
        setCourses(loadedCourses);
        setSelectedCourseId(selected);
        const current = loadedCourses.find(c => c.id === selected);
        if (current) {
          setEvaluations(current.evaluations || []);
          setExigenciaPercent(current.exigenciaPercent ?? 60);
          setPassGradeThreshold(current.passGradeThreshold ?? 4.0);
          setExemptionThreshold(current.exemptionThreshold ?? 5.5);
        }
        setIsHydrated(true);
        return;
      }

      // Migration path from old single-course key
      const rawV1 = localStorage.getItem("nm.promedio.v1");
      if (rawV1) {
        const data = JSON.parse(rawV1);
        const migratedCourse = {
          id: (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
            ? globalThis.crypto.randomUUID()
            : String(Date.now() + Math.random()),
          name: "Curso",
          evaluations: Array.isArray(data.evaluations) && data.evaluations.length > 0 ? data.evaluations : [],
          exigenciaPercent: data.exigenciaPercent ?? 60,
          passGradeThreshold: data.passGradeThreshold ?? 4.0,
          exemptionThreshold: data.exemptionThreshold ?? 5.5,
        };
        const payload = { courses: [migratedCourse], selectedCourseId: migratedCourse.id };
        localStorage.setItem("nm.courses.v1", JSON.stringify(payload));
        setCourses(payload.courses);
        setSelectedCourseId(payload.selectedCourseId);
        setEvaluations(migratedCourse.evaluations);
        setExigenciaPercent(migratedCourse.exigenciaPercent);
        setPassGradeThreshold(migratedCourse.passGradeThreshold);
        setExemptionThreshold(migratedCourse.exemptionThreshold);
        setIsHydrated(true);
        return;
      }

      // Fresh start: seed one default course
      const defaultCourse = {
        id: (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
          ? globalThis.crypto.randomUUID()
          : String(Date.now() + Math.random()),
        name: "Curso 1",
        ...createDefaultCourseData(),
      };
      const payload = { courses: [defaultCourse], selectedCourseId: defaultCourse.id };
      localStorage.setItem("nm.courses.v1", JSON.stringify(payload));
      setCourses(payload.courses);
      setSelectedCourseId(payload.selectedCourseId);
      setEvaluations(defaultCourse.evaluations);
      setExigenciaPercent(defaultCourse.exigenciaPercent);
      setPassGradeThreshold(defaultCourse.passGradeThreshold);
      setExemptionThreshold(defaultCourse.exemptionThreshold);
      setIsHydrated(true);
    } catch {}
  }, []);

  // Ensure a selected course exists after hydration
  useEffect(() => {
    if (!isHydrated) return;
    if (!selectedCourseId && courses.length > 0) {
      const first = courses[0];
      setSelectedCourseId(first.id);
      setEvaluations(first.evaluations || []);
      setExigenciaPercent(first.exigenciaPercent ?? 60);
      setPassGradeThreshold(first.passGradeThreshold ?? 4.0);
      setExemptionThreshold(first.exemptionThreshold ?? 5.5);
    }
  }, [isHydrated, courses, selectedCourseId]);

  // Sync local editing state into the selected course data
  useEffect(() => {
    if (!selectedCourseId) return;
    setCourses((prev) => prev.map((c) => (
      c.id === selectedCourseId
        ? {
            ...c,
            evaluations,
            exigenciaPercent,
            passGradeThreshold,
            exemptionThreshold,
          }
        : c
    )));
  }, [selectedCourseId, evaluations, exigenciaPercent, passGradeThreshold, exemptionThreshold]);

  // Persist courses
  useEffect(() => {
    try {
      localStorage.setItem("nm.courses.v1", JSON.stringify({ courses, selectedCourseId }));
    } catch {}
  }, [courses, selectedCourseId]);

  const handleSelectCourse = (id) => {
    setSelectedCourseId(id);
    const course = courses.find((c) => c.id === id);
    if (course) {
      setEvaluations(course.evaluations || []);
      setExigenciaPercent(course.exigenciaPercent ?? 60);
      setPassGradeThreshold(course.passGradeThreshold ?? 4.0);
      setExemptionThreshold(course.exemptionThreshold ?? 5.5);
    }
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInputValue, setCreateInputValue] = useState("");
  const handleAddCourse = () => {
    setCreateInputValue(`Curso ${courses.length + 1}`);
    setIsCreateOpen(true);
  };
  const performCreateCourse = () => {
    const id = (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
      ? globalThis.crypto.randomUUID()
      : String(Date.now() + Math.random());
    const name = String(createInputValue || "").trim() || `Curso ${courses.length + 1}`;
    const data = createDefaultCourseData();
    const newCourse = { id, name, ...data };
    setCourses((prev) => [...prev, newCourse]);
    setSelectedCourseId(id);
    setEvaluations(data.evaluations);
    setExigenciaPercent(data.exigenciaPercent);
    setPassGradeThreshold(data.passGradeThreshold);
    setExemptionThreshold(data.exemptionThreshold);
    setIsCreateOpen(false);
  };

  const handleRenameCourse = () => {
    const current = courses.find((c) => c.id === selectedCourseId);
    if (!current) return;
    setRenameInputValue(current.name || "Curso");
    setIsRenameOpen(true);
  };

  const handleDeleteCourse = () => {
    setIsDeleteOpen(true);
  };

  // Modal state for rename/delete
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameInputValue, setRenameInputValue] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const performRenameCourse = () => {
    const trimmed = String(renameInputValue || "").trim();
    if (!trimmed) {
      setIsRenameOpen(false);
      return;
    }
    setCourses((prev) => prev.map((c) => (c.id === selectedCourseId ? { ...c, name: trimmed } : c)));
    setIsRenameOpen(false);
  };

  const performDeleteCourse = () => {
    if (!selectedCourseId) {
      setIsDeleteOpen(false);
      return;
    }
    const remaining = courses.filter((c) => c.id !== selectedCourseId);
    if (remaining.length === 0) {
      const fallback = {
        id: (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
          ? globalThis.crypto.randomUUID()
          : String(Date.now() + Math.random()),
        name: "Curso 1",
        ...createDefaultCourseData(),
      };
      setCourses([fallback]);
      setSelectedCourseId(fallback.id);
      setEvaluations(fallback.evaluations);
      setExigenciaPercent(fallback.exigenciaPercent);
      setPassGradeThreshold(fallback.passGradeThreshold);
      setExemptionThreshold(fallback.exemptionThreshold);
      setIsDeleteOpen(false);
      return;
    }
    const next = remaining[0];
    setCourses(remaining);
    setSelectedCourseId(next.id);
    setEvaluations(next.evaluations);
    setExigenciaPercent(next.exigenciaPercent);
    setPassGradeThreshold(next.passGradeThreshold);
    setExemptionThreshold(next.exemptionThreshold);
    setIsDeleteOpen(false);
  };

  const hasExam = useMemo(() =>
    evaluations.some((ev) => String(ev.name || "").toLowerCase().trim() === "examen"),
  [evaluations]);

  const handleAddExam = () => {
    // Try to use the remaining weight if positive, else fallback to 30
    const currentTotal = evaluations.reduce((acc, ev) => acc + (Number(ev.weightPercent) || 0), 0);
    const remaining = 100 - currentTotal;
    const proposed = remaining > 0 ? remaining : 30;
    const exam = {
      ...createEmptyEvaluation(),
      name: "Examen",
      weightPercent: clamp(Number(proposed) || 30, 5, 80),
      inputMode: "grade",
      grade: "",
    };
    setEvaluations((prev) => [...prev, exam]);
  };

  // Export / Import (backup) of local storage data
  const handleExport = () => {
    try {
      const payload = { courses, selectedCourseId };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `notaminima-promedio-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importError, setImportError] = useState("");
  const [importData, setImportData] = useState(null);
  const [isBackupInfoOpen, setIsBackupInfoOpen] = useState(false);

  const handleOpenImport = () => {
    setImportError("");
    setImportData(null);
    setIsImportOpen(true);
  };

  const validateImported = (data) => {
    // Accept new schema or migrate old single-course payload
    if (data && Array.isArray(data.courses)) {
      return {
        courses: data.courses,
        selectedCourseId: data.selectedCourseId || data.courses[0]?.id || "",
      };
    }
    if (data && Array.isArray(data.evaluations)) {
      const migrated = {
        id: (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
          ? globalThis.crypto.randomUUID()
          : String(Date.now() + Math.random()),
        name: "Curso importado",
        evaluations: data.evaluations,
        exigenciaPercent: data.exigenciaPercent ?? 60,
        passGradeThreshold: data.passGradeThreshold ?? 4.0,
        exemptionThreshold: data.exemptionThreshold ?? 5.5,
      };
      return { courses: [migrated], selectedCourseId: migrated.id };
    }
    return null;
  };

  const handleFileChosen = async (file) => {
    setImportError("");
    setImportData(null);
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const validated = validateImported(json);
      if (!validated || !Array.isArray(validated.courses) || validated.courses.length === 0) {
        setImportError("Archivo inválido. Asegúrate de seleccionar un backup exportado por la app.");
        return;
      }
      setImportData(validated);
    } catch {
      setImportError("No se pudo leer el archivo JSON.");
    }
  };

  const performImport = () => {
    if (!importData) {
      setIsImportOpen(false);
      return;
    }
    try {
      localStorage.setItem("nm.courses.v1", JSON.stringify(importData));
      setCourses(importData.courses);
      setSelectedCourseId(importData.selectedCourseId);
      const current = importData.courses.find((c) => c.id === importData.selectedCourseId) || importData.courses[0];
      if (current) {
        setEvaluations(current.evaluations || []);
        setExigenciaPercent(current.exigenciaPercent ?? 60);
        setPassGradeThreshold(current.passGradeThreshold ?? 4.0);
        setExemptionThreshold(current.exemptionThreshold ?? 5.5);
      }
    } catch {}
    setIsImportOpen(false);
  };

  // Convert points to grade (piecewise linear with exigencia)
  const pointsToGrade = (achieved, total, exigencia) => {
    const safeTotal = Math.max(1, Number(total) || 1);
    const safeAchieved = clamp(Number(achieved) || 0, 0, safeTotal);
    const pct = (safeAchieved / safeTotal) * 100;
    const ex = clamp(Number(exigencia) || 60, 20, 95);
    let g;
    if (pct <= ex) {
      g = 1.0 + (pct / ex) * 3.0;
    } else {
      g = 4.0 + ((pct - ex) / (100 - ex)) * 3.0;
    }
    return clamp(g, 1.0, 7.0);
  };

  // Inverse: from grade target to required percent and points
  const gradeToPercent = (grade, exigencia) => {
    const g = clamp(Number(grade) || 0, 1.0, 7.0);
    const ex = clamp(Number(exigencia) || 60, 20, 95);
    if (g <= 4.0) {
      return ((g - 1.0) / 3.0) * ex;
    }
    return ex + ((g - 4.0) / 3.0) * (100 - ex);
  };

  const normalizedEvaluations = useMemo(() => {
    return evaluations.map((ev) => {
      const weight = clamp(Number(ev.weightPercent) || 0, 0, 100);
      // Treat 0 as "not yet done" so it doesn't count as completed
      const raw = Number(ev.grade);
      const gradeValue = !raw || raw < 1 ? null : clamp(raw, 1.0, 7.0);
      return { ...ev, weightPercent: weight, gradeValue };
    });
  }, [evaluations]);

  const totals = useMemo(() => {
    // Identify exam (by name)
    const examIndex = normalizedEvaluations.findIndex((ev) => String(ev.name || "").trim().toLowerCase() === "examen");
    const hasExam = examIndex !== -1;
    const examWeight = hasExam ? (Number(normalizedEvaluations[examIndex].weightPercent) || 0) : 0;
    const nonExam = normalizedEvaluations.filter((_, idx) => idx !== examIndex);
    const nonExamRawTotal = nonExam.reduce((acc, ev) => acc + (Number(ev.weightPercent) || 0), 0);

    // Effective weights mapping
    const effectiveWeights = new Map();
    if (hasExam) {
      // Distribute (100 - examWeight) across non-exam by their raw proportions
      const base = Math.max(0, 100 - examWeight);
      const denom = nonExamRawTotal > 0 ? nonExamRawTotal : 1;
      nonExam.forEach((ev) => {
        const eff = ((Number(ev.weightPercent) || 0) / denom) * base;
        effectiveWeights.set(ev.id, eff);
      });
      effectiveWeights.set(normalizedEvaluations[examIndex].id, examWeight);
    } else {
      normalizedEvaluations.forEach((ev) => {
        effectiveWeights.set(ev.id, Number(ev.weightPercent) || 0);
      });
    }

    // Contributions based on effective weights
    let completedWeight = 0;
    let weightedSum = 0;
    normalizedEvaluations.forEach((ev) => {
      const eff = effectiveWeights.get(ev.id) || 0;
      if (ev.gradeValue != null) {
        completedWeight += eff;
        weightedSum += (ev.gradeValue * eff) / 100;
      }
    });
    const currentAverage = completedWeight > 0 ? (weightedSum / (completedWeight / 100)) : null;
    const remainingWeight = Math.max(0, 100 - completedWeight);
    const finalIfAllSevens = weightedSum + (7.0 * remainingWeight) / 100;
    const warningWeight = hasExam ? nonExamRawTotal : normalizedEvaluations.reduce((acc, ev) => acc + (Number(ev.weightPercent) || 0), 0);

    return { effectiveWeights, warningWeight, completedWeight, weightedSum, currentAverage, remainingWeight, finalIfAllSevens, hasExam, examWeight, nonExamRawTotal };
  }, [normalizedEvaluations]);

  const neededForPass = useMemo(() => {
    // Solve for minimal average on remaining portion to reach passGradeThreshold overall
    const remainingWeight = Math.max(0, 100 - totals.completedWeight);
    if (remainingWeight === 0) return null;
    const target = passGradeThreshold;
    const currentContribution = totals.weightedSum; // already weighted on 0..7 scale
    // We need: (currentContribution + x * remainingWeight/100) >= target
    // Multiply by 100 to avoid fractions in reasoning (but math is straightforward):
    // currentContribution + x * (remainingWeight/100) >= target
    // x >= (target - currentContribution) / (remainingWeight/100)
    const needed = (target - currentContribution) / (remainingWeight / 100);
    return clamp(needed, 1.0, 7.0);
  }, [totals, passGradeThreshold]);

  // Minimal average on remaining portion to reach the eximición threshold overall
  const neededForExemption = useMemo(() => {
    const remainingWeight = Math.max(0, 100 - totals.completedWeight);
    if (remainingWeight === 0) return null;
    const target = exemptionThreshold;
    const currentContribution = totals.weightedSum;
    const needed = (target - currentContribution) / (remainingWeight / 100);
    return clamp(needed, 1.0, 7.0);
  }, [totals, exemptionThreshold]);

  // Per-next-evaluation requirement: minimal grade for the very next pending evaluation
  const nextEvaluationRequirement = useMemo(() => {
    // Find the first pending grade-mode evaluation
    const pendingIndex = evaluations.findIndex((ev) => (!ev.grade || Number(ev.grade) < 1));
    if (pendingIndex === -1) return null;

    const target = passGradeThreshold;
    const safeEvs = evaluations.map((ev) => ({
      grade: ev.grade,
      weight: clamp(Number(ev.weightPercent) || 0, 0, 100),
      name: ev.name || "Evaluación",
    }));

    const next = safeEvs[pendingIndex];
    const nextWeight = next.weight;
    if (nextWeight <= 0) return { name: next.name, gradeNeeded: null };

    // Sum contributions excluding the next pending
    let currentSum = 0;
    safeEvs.forEach((ev, idx) => {
      if (idx === pendingIndex) return;
      const g = !ev.grade || Number(ev.grade) < 1 ? null : clamp(Number(ev.grade) || 0, 1.0, 7.0);
      if (g != null) currentSum += (g * ev.weight) / 100;
    });

    // Need: (currentSum + x * nextWeight/100 + futureAvg * restWeight/100) >= target
    // For a conservative per-next suggestion, assume future pending after next can reach at most 7.0 average.
    const restWeight = Math.max(0, 100 - nextWeight - safeEvs.reduce((a, ev, idx) => a + (idx !== pendingIndex && (ev.grade != null && Number(ev.grade) >= 1) ? ev.weight : 0), 0));
    const optimisticFuture = 7.0; // best case for remaining after next
    const futureContribution = (optimisticFuture * restWeight) / 100;
    // Solve for x on next: currentSum + x*nextWeight/100 + futureContribution >= target
    const requiredNext = (target - currentSum - futureContribution) / (nextWeight / 100);
    const gradeNeeded = clamp(requiredNext, 1.0, 7.0);
    return { name: next.name, gradeNeeded };
  }, [evaluations, passGradeThreshold, exigenciaPercent]);

  const status = useMemo(() => {
    if (totals.currentAverage == null) return { label: "Incompleto", color: "#64748b" };
    const needsExamBecauseNotExempt = Math.round(totals.completedWeight) >= 100 && totals.currentAverage < exemptionThreshold;
    // Si completó 100% pero no alcanza eximición, indicar que falta examen
    if (needsExamBecauseNotExempt) {
      return { label: "Debe rendir examen", color: "#f59e0b" };
    }
    // Si 100% del peso está rendido (y no requiere examen), mostrar estado final
    if (Math.round(totals.completedWeight) >= 100) {
      return totals.currentAverage >= passGradeThreshold
        ? { label: "Aprobado", color: "#16a34a" }
        : { label: "Reprobado", color: "#ef4444" };
    }
    if (totals.currentAverage >= exemptionThreshold) return { label: "Eximición posible", color: "#0ea5e9" };
    if (totals.currentAverage >= passGradeThreshold) return { label: "Vas aprobando", color: "#16a34a" };
    return { label: "Bajo aprobación", color: "#f59e0b" };
  }, [totals, passGradeThreshold, exemptionThreshold]);

  const exemptionStatus = useMemo(() => {
    if (totals.currentAverage == null) return null;
    const ok = totals.currentAverage >= exemptionThreshold;
    return {
      ok,
      text: ok ? "Te eximes del examen con el promedio actual" : "No te eximes del examen con el promedio actual",
      color: ok ? 'var(--color-success)' : 'var(--color-danger)'
    };
  }, [totals, exemptionThreshold]);

  // Removed cumulative estimated average to reduce cognitive load

  const updateEvaluation = (id, patch) => {
    setEvaluations((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)));
  };

  const addEvaluation = () => {
    setEvaluations((prev) => [...prev, createEmptyEvaluation()]);
  };

  const removeEvaluation = (id) => {
    setEvaluations((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <main>
      <section className="container py-12 sm:py-16">
        <div className="mb-3">
          <span className="kicker">Calculadora de promedio</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl/[1.15] sm:text-4xl/[1.1] font-semibold tracking-tight">Promedio ponderado y nota mínima</h1>
            <p className="mt-3 max-w-[60ch] text-base" style={{ color: "var(--color-text-muted)" }}>
              Ingresa tus evaluaciones, ajusta exigencia y mira tu promedio, estado y lo que necesitas para aprobar.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-2 sm:mt-1">
            <button type="button" className="btn btn-ghost" onClick={handleExport}>Descargar</button>
            <button type="button" className="btn btn-primary" onClick={handleOpenImport}>Cargar</button>
            <button
              type="button"
              aria-label="Información sobre descargar y cargar"
              className="btn btn-ghost"
              onClick={() => setIsBackupInfoOpen(true)}
            >
              i
            </button>

            {isBackupInfoOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsBackupInfoOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 card p-4 w-[min(92vw,360px)]">
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <strong>Descargar</strong>: guarda un archivo JSON con tus cursos y evaluaciones para respaldo.
                  </p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <strong>Cargar</strong>: selecciona un archivo JSON exportado para restaurar tus datos. Reemplaza los datos actuales.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button type="button" className="btn btn-primary" onClick={() => setIsBackupInfoOpen(false)}>Entendido</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {/* Form */}
          <div className="order-2 lg:order-1 lg:col-span-2 card p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold">Evaluaciones</h2>
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-medium" htmlFor="course-select">Curso</label>
                <select
                  id="course-select"
                  className="border rounded-md px-3 py-2"
                  value={selectedCourseId || (courses[0]?.id || "")}
                  onChange={(e) => handleSelectCourse(e.target.value)}
                >
                  {courses.length === 0 && <option value="">—</option>}
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name || "Curso"}</option>
                  ))}
                </select>
                <button type="button" className="btn btn-ghost" onClick={handleAddCourse}>Agregar curso</button>
                <button type="button" className="btn btn-ghost" onClick={handleRenameCourse}>Renombrar</button>
                <button type="button" className="btn btn-ghost" onClick={handleDeleteCourse}>Eliminar</button>
              </div>
            </div>
            {(() => {
              // Recomendar completar pesos si no hay examen; con examen, el 100% efectivo se controla por la lógica de redistribución.
              if (totals.hasExam) return null;
              const rawTotal = totals.warningWeight || 0;
              if (rawTotal === 100) return null;
              return (
                <div className="mt-3 card p-3" style={{ borderColor: rawTotal > 100 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Los pesos suman {formatNumber(rawTotal, 0)}%. {rawTotal > 100 ? 'Reduce' : 'Completa'} hasta 100%.
                  </p>
                </div>
              );
            })()}
            <div className="mt-4 grid gap-4">
              {!isHydrated && (
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Cargando datos…
                </div>
              )}
              {isHydrated && courses.length === 1 && (evaluations?.length || 0) === 0 && (
                <div className="card p-4">
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Agrega tus evaluaciones y pesos. Puedes crear más cursos con el botón “Agregar curso”.
                  </p>
                </div>
              )}
              {normalizedEvaluations.map((ev) => (
                <div key={ev.id} className="card p-4">
                  <div className="grid gap-3 md:grid-cols-4 items-start">
                    <div className="min-w-0 md:col-span-3 grid gap-1">
                      <label className="text-sm font-medium">Nombre</label>
                      <input
                        type="text"
                        className="w-full border rounded-md px-3 py-2"
                        value={ev.name}
                        onChange={(e) => updateEvaluation(ev.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="min-w-0 md:col-span-1 grid gap-1">
                      <label className="text-sm font-medium">Peso (%)</label>
                      <input
                        type="number"
                        className="w-full border rounded-md px-3 py-2"
                        min={0}
                        max={100}
                        value={ev.weightPercent}
                        onChange={(e) => updateEvaluation(ev.id, { weightPercent: e.target.value })}
                      />
                    </div>
                    {/* Modo fijo: Nota. Badge eliminada para simplificar el layout */}
                  </div>

                  {true ? (
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <div className="min-w-0 grid gap-1">
                        <label className="text-sm font-medium">Nota (1.0–7.0)</label>
                        {(() => {
                          const isInvalid = ev.grade !== "" && Number(ev.grade) > 0 && (Number(ev.grade) < 1 || Number(ev.grade) > 7);
                          return (
                            <>
                              <input
                                type="number"
                                className="w-full border rounded-md px-3 py-2"
                                min={1}
                                max={7}
                                step={0.1}
                                value={ev.grade ?? ""}
                                onChange={(e) => updateEvaluation(ev.id, { grade: e.target.value })}
                                onBlur={(e) => {
                                  const raw = e.target.value;
                                  if (raw === "" || Number(raw) === 0) return; // pendiente
                                  const num = Number(raw);
                                  const fixed = clamp(isNaN(num) ? 0 : num, 1.0, 7.0);
                                  if (fixed !== num) updateEvaluation(ev.id, { grade: fixed });
                                }}
                                style={isInvalid ? { borderColor: 'var(--color-danger)' } : undefined}
                              />
                              {isInvalid && (
                                <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                                  Ingresa una nota entre 1,0 y 7,0. Deja 0 si está pendiente.
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      {ev.gradeValue != null ? (
                        (() => {
                          const w = Number(ev.weightPercent) || 0;
                          const contrib = (ev.gradeValue * w) / 100;
                          return (
                            <>Contribuye con {formatNumber(contrib, 1)} ({formatNumber(w, 0)}%) con nota {formatNumber(ev.gradeValue, 1)}</>
                          );
                        })()
                      ) : (
                        <>Pendiente: se usará para calcular lo que falta</>
                      )}
                    </div>
                    <button type="button" className="btn btn-ghost" onClick={() => removeEvaluation(ev.id)}>Eliminar</button>
                  </div>

                  {(() => {
                    const isExam = String(ev.name || "").trim().toLowerCase() === "examen";
                    const examPending = ev.inputMode === "grade" && (!ev.grade || Number(ev.grade) < 1);
                    const rawExamWeight = Number(ev.weightPercent) || 0;
                    if (!isExam || !examPending || rawExamWeight <= 0) return null;

                    // Con examen presente, los pesos efectivos reescalan no-examen a (100 - examWeight)
                    const effExamWeight = totals.examWeight || 0;
                    const nonExamEffTotal = Math.max(0, 100 - effExamWeight);

                    // Suma efectiva actual sin el examen
                    let currentWithoutExam = 0;
                    normalizedEvaluations.forEach((item) => {
                      if (String(item.name || "").trim().toLowerCase() === "examen") return;
                      if (item.gradeValue == null) return;
                      const eff = (totals.effectiveWeights?.get(item.id) || 0);
                      currentWithoutExam += (item.gradeValue * eff) / 100;
                    });

                    // Necesario en examen para alcanzar aprobación: current + x*(examEff/100) >= pass
                    const examEff = effExamWeight;
                    const needed = (passGradeThreshold - currentWithoutExam) / (examEff / 100);
                    const clamped = clamp(needed, 1.0, 7.0);
                    return (
                      <p className="mt-2 text-sm" style={{ color: needed > 7.0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                        {needed > 7.0
                          ? 'Solo con el examen no es posible aprobar'
                          : `Para aprobar el ramo necesitas aprox. nota ${formatNumber(clamped, 1)} en el examen`}
                      </p>
                    );
                  })()}
                </div>
              ))}

              <div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-ghost" onClick={addEvaluation}>Agregar evaluación</button>
                  {!hasExam && (
                    <button type="button" className="btn btn-primary" onClick={handleAddExam}>Agregar examen</button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="card p-4">
                  <p className="text-sm font-medium">Exigencia (% para nota 4.0)</p>
                  <div className="mt-2 flex items-center gap-3">
                    <input
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
                        <button key={preset} type="button" className="btn btn-ghost" onClick={() => setExigenciaPercent(preset)}>
                          {preset}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <p className="text-sm font-medium">Aprobación (nota mínima)</p>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="number"
                      className="w-28 border rounded-md px-3 py-2"
                      min={1}
                      max={7}
                      step={0.1}
                      value={passGradeThreshold}
                      onChange={(e) => setPassGradeThreshold(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      {[4.0, 4.5].map((preset) => (
                        <button key={preset} type="button" className="btn btn-ghost" onClick={() => setPassGradeThreshold(preset)}>
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <p className="text-sm font-medium">Eximición (opcional)</p>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="number"
                      className="w-28 border rounded-md px-3 py-2"
                      min={1}
                      max={7}
                      step={0.1}
                      value={exemptionThreshold}
                      onChange={(e) => setExemptionThreshold(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      {[5.5, 6.0].map((preset) => (
                        <button key={preset} type="button" className="btn btn-ghost" onClick={() => setExemptionThreshold(preset)}>
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="order-1 lg:order-2 card p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-base font-semibold">Resultado</h2>
            <div className="mt-4 grid gap-3">
              <div>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Progreso</p>
                <p className="text-lg font-medium">{formatNumber(totals.completedWeight, 0)}% del curso con nota</p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Promedio acumulado</p>
                <p className="text-4xl font-semibold tracking-tight">{`Nota ${formatNumber(totals.weightedSum || 0, 1)}`}</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Estado: <span style={{ color: status.color }}>{status.label}</span></p>
              </div>
              
              <div className="card p-4">
                <p className="text-sm font-medium">¿Qué necesito para aprobar?</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {(() => {
                    const remainingWeight = Math.max(0, 100 - totals.completedWeight);
                    const need = neededForPass;
                    if (remainingWeight === 0) {
                      if (totals.currentAverage != null && totals.currentAverage >= passGradeThreshold) {
                        return "Ya aseguras la aprobación";
                      }
                      return "No quedan evaluaciones pendientes";
                    }
                    if (need == null || isNaN(need)) return "—";
                    if (need > 7.0) return "No es posible aprobar con lo que queda";
                    if (need <= 1.0) return "Ya aseguras la aprobación";

                    // Sugerir misma nota para cada pendiente en modo 'Nota'
                    const pendingGradeItems = evaluations.filter((ev) => ev.inputMode === "grade" && (!ev.grade || Number(ev.grade) < 1)).slice(0, 4);
                    if (pendingGradeItems.length > 0) {
                      const gradeStr = formatNumber(need, 1);
                      const list = pendingGradeItems.map((ev) => `${ev.name || "Evaluación"}: ${gradeStr}`).join(" · ");
                      return `Para aprobar, promedia ${gradeStr} en los pendientes: ${list}${evaluations.length > 4 ? "…" : ""}.`;
                    }

                    return `Necesitas promedio ${formatNumber(need, 1)} en el ${formatNumber(remainingWeight, 0)}% restante.`;
                  })()}
                </p>
                {(() => {
                  if (totals.currentAverage == null) return null;
                  if (totals.currentAverage >= exemptionThreshold) {
                    return (
                      <p className="mt-2 text-sm" style={{ color: 'var(--color-success)' }}>
                        Te eximes del examen con el promedio actual
                      </p>
                    );
                  }
                  if (totals.currentAverage >= passGradeThreshold) {
                    // Aprobando pero sin eximición. Mostrar cuánto necesitaría para eximirse
                    const remainingWeight = Math.max(0, 100 - totals.completedWeight);
                    if (remainingWeight > 0 && neededForExemption != null && !isNaN(neededForExemption)) {
                      return (
                        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          Aprobando. Para eximirte, promedia {formatNumber(neededForExemption, 1)} en el {formatNumber(remainingWeight, 0)}% restante.
                        </p>
                      );
                    }
                    return (
                      <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Aprobando, pero no alcanza la eximición.
                      </p>
                    );
                  }
                  return (
                    <p className="mt-2 text-sm" style={{ color: 'var(--color-danger)' }}>
                      No te eximes del examen con el promedio actual
                    </p>
                  );
                })()}
                  {totals.remainingWeight > 0 ? (
                    <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {`Si te sacas 7.0 en todo lo que queda, llegarías a nota ${formatNumber(totals.finalIfAllSevens, 1)}.`}
                    </p>
                  ) : (
                    totals.currentAverage != null && totals.currentAverage >= exemptionThreshold ? (
                      <p className="mt-2 text-sm" style={{ color: 'var(--color-success)' }}>
                        Peso completo. Nota final: {formatNumber(totals.weightedSum, 1)} — Aprobado.
                      </p>
                    ) : null
                  )}
                {nextEvaluationRequirement && (
                  <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Próxima: en {nextEvaluationRequirement.name} necesitas aprox. nota {formatNumber(nextEvaluationRequirement.gradeNeeded, 1)} asumiendo el mejor desempeño posterior.
                  </p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="card p-4">
                  <p className="text-sm font-medium">Regla de escala</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>0% → 1.0 · {exigenciaPercent}% → 4.0 · 100% → 7.0</p>
                </div>
                <div className="card p-4">
                  <p className="text-sm font-medium">Sugerencia</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Ajusta exigencia si tu curso usa 70% u otro valor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rename Course Modal */}
      {isRenameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsRenameOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            className="relative card w-[min(92vw,480px)] p-5 sm:p-6"
          >
            <h3 className="text-base font-semibold">Renombrar curso</h3>
            <div className="mt-3 grid gap-2">
              <label className="text-sm font-medium" htmlFor="rename-input">Nombre</label>
              <input
                id="rename-input"
                autoFocus
                className="w-full border rounded-md px-3 py-2"
                value={renameInputValue}
                onChange={(e) => setRenameInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') performRenameCourse(); }}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => setIsRenameOpen(false)}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={performRenameCourse}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsCreateOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative card w-[min(92vw,480px)] p-5 sm:p-6">
            <h3 className="text-base font-semibold">Nuevo curso</h3>
            <div className="mt-3 grid gap-2">
              <label className="text-sm font-medium" htmlFor="create-input">Nombre</label>
              <input
                id="create-input"
                autoFocus
                className="w-full border rounded-md px-3 py-2"
                value={createInputValue}
                onChange={(e) => setCreateInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') performCreateCourse(); }}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => setIsCreateOpen(false)}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={performCreateCourse}>Crear</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Confirm Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsDeleteOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative card w-[min(92vw,460px)] p-5 sm:p-6">
            <h3 className="text-base font-semibold">Eliminar curso</h3>
            <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              ¿Seguro que quieres eliminar este curso? Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => setIsDeleteOpen(false)}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={performDeleteCourse}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsImportOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative card w-[min(92vw,520px)] p-5 sm:p-6">
            <h3 className="text-base font-semibold">Cargar backup</h3>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Selecciona un archivo JSON exportado desde esta página para restaurar tus cursos y evaluaciones.
            </p>
            <div className="mt-4">
              <input
                type="file"
                accept="application/json,.json"
                onChange={(e) => handleFileChosen(e.target.files && e.target.files[0])}
              />
            </div>
            {importError && (
              <p className="mt-3 text-sm" style={{ color: 'var(--color-danger)' }}>{importError}</p>
            )}
            {importData && (
              <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Se encontró {importData.courses.length} curso(s). Al confirmar, reemplazarán tus datos actuales.
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => setIsImportOpen(false)}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={performImport} disabled={!importData}>Importar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


