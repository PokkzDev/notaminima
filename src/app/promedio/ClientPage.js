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

function sanitizeIntegerInput(value) {
  return String(value ?? '').replace(/[^0-9]/g, '');
}

function sanitizeDecimalInput(value) {
  let v = String(value ?? '').replace(',', '.').replace(/[^0-9.]/g, '');
  const firstDot = v.indexOf('.');
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
  }
  return v;
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // New onboarding and UX states
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showCourseManagement, setShowCourseManagement] = useState(false);
  const [showBackupSection, setShowBackupSection] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // For onboarding steps

  // Quick start with example data
  const createExampleData = () => {
    const exampleEvaluations = [
      { ...createEmptyEvaluation(), name: "Prueba 1", weightPercent: 25, grade: 5.8 },
      { ...createEmptyEvaluation(), name: "Tarea", weightPercent: 15, grade: 6.2 },
      { ...createEmptyEvaluation(), name: "Prueba 2", weightPercent: 30, grade: "" },
      { ...createEmptyEvaluation(), name: "Proyecto", weightPercent: 30, grade: "" },
    ];
    return exampleEvaluations;
  };

  const startWithExample = () => {
    const exampleEvaluations = createExampleData();
    setEvaluations(exampleEvaluations);
    setIsFirstTime(false);
    setCurrentStep(0);
    
    // Update the current course with example data
    setCourses((prev) => prev.map((c) => (
      c.id === selectedCourseId
        ? { ...c, evaluations: exampleEvaluations }
        : c
    )));
  };

  const startFromScratch = () => {
    setIsFirstTime(false);
    setCurrentStep(0);
  };

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
        // If user has data, they're not first-time
        // First time only if: no courses OR all courses are empty
        const hasAnyData = loadedCourses.some(course => 
          course.evaluations && course.evaluations.length > 0
        );
        setIsFirstTime(!hasAnyData);
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
        // Not first time if migrated course has any evaluations
        setIsFirstTime(migratedCourse.evaluations.length === 0);
        setIsHydrated(true);
        return;
      }

      // Fresh start: seed one default course
      const defaultCourse = {
        id: (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
          ? globalThis.crypto.randomUUID()
          : String(Date.now() + Math.random()),
        name: "Mi Curso",
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
      setIsFirstTime(true); // Fresh start means first time
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
    // Default exam weight (can be changed later)
    const examWeight = 30; // Standard 30% for exam
    
    const exam = {
      ...createEmptyEvaluation(),
      name: "Examen",
      weightPercent: examWeight,
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

    if (hasExam) {
      // Chilean system: Simple average of regular evaluations, then apply remaining weight
      const remainingWeight = Math.max(0, 100 - examWeight);
      
      // Calculate simple average of non-exam evaluations (not weighted)
      let nonExamSum = 0;
      let nonExamCount = 0;
      nonExam.forEach((ev) => {
        if (ev.gradeValue != null) {
          nonExamSum += ev.gradeValue;
          nonExamCount++;
        }
      });
      const nonExamAverage = nonExamCount > 0 ? nonExamSum / nonExamCount : 0;
      
      // Calculate weighted contributions
      let weightedSum = 0;
      let completedWeight = 0;
      
      // Contribution from regular evaluations (simple average × remaining weight)
      if (nonExamCount > 0) {
        weightedSum += (nonExamAverage * remainingWeight) / 100;
        completedWeight += remainingWeight;
      }
      
      // Contribution from exam
      const examEv = normalizedEvaluations[examIndex];
      if (examEv.gradeValue != null) {
        weightedSum += (examEv.gradeValue * examWeight) / 100;
        completedWeight += examWeight;
      }
      
      const currentAverage = completedWeight > 0 ? (weightedSum / (completedWeight / 100)) : null;
      const remainingWeight_final = Math.max(0, 100 - completedWeight);
      const finalIfAllSevens = weightedSum + (7.0 * remainingWeight_final) / 100;
      
      // For UI display: show original weights (not effective)
      const effectiveWeights = new Map();
      normalizedEvaluations.forEach((ev) => {
        effectiveWeights.set(ev.id, Number(ev.weightPercent) || 0);
      });
      
      return { 
        effectiveWeights, 
        warningWeight: nonExamRawTotal, 
        completedWeight, 
        weightedSum, 
        currentAverage, 
        remainingWeight: remainingWeight_final, 
        finalIfAllSevens, 
        hasExam, 
        examWeight, 
        nonExamRawTotal,
        nonExamAverage,
        nonExamCount 
      };
    } else {
      // Without exam: original weighted logic
      const effectiveWeights = new Map();
      normalizedEvaluations.forEach((ev) => {
        effectiveWeights.set(ev.id, Number(ev.weightPercent) || 0);
      });

      let completedWeight = 0;
      let weightedSum = 0;
      normalizedEvaluations.forEach((ev) => {
        const weight = Number(ev.weightPercent) || 0;
        if (ev.gradeValue != null) {
          completedWeight += weight;
          weightedSum += (ev.gradeValue * weight) / 100;
        }
      });
      
      const currentAverage = completedWeight > 0 ? (weightedSum / (completedWeight / 100)) : null;
      const remainingWeight = Math.max(0, 100 - completedWeight);
      const finalIfAllSevens = weightedSum + (7.0 * remainingWeight) / 100;
      const warningWeight = normalizedEvaluations.reduce((acc, ev) => acc + (Number(ev.weightPercent) || 0), 0);

      return { effectiveWeights, warningWeight, completedWeight, weightedSum, currentAverage, remainingWeight, finalIfAllSevens, hasExam, examWeight, nonExamRawTotal };
    }
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
  }, [evaluations, passGradeThreshold]);

  const status = useMemo(() => {
    if (totals.currentAverage == null) return { label: "Incompleto", color: "#64748b" };
    
    // Check if exam is rendered (has a grade)
    const examEval = normalizedEvaluations.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen");
    const examIsRendered = examEval && examEval.gradeValue != null;
    const hasExam = totals.hasExam;
    
    // If exam exists and is rendered, or if 100% weight is completed, determine final status
    const isFinalState = Math.round(totals.completedWeight) >= 100 || (hasExam && examIsRendered);
    
    if (isFinalState) {
      // Si alcanza eximición → Aprobado (eximido del examen)
      if (totals.currentAverage >= exemptionThreshold) {
        return { label: "Aprobado (eximido)", color: "#16a34a" };
      }
      // Si alcanza aprobación pero no eximición
      if (totals.currentAverage >= passGradeThreshold) {
        // Si alcanza la eximición, se eximió (esto ya se verificó arriba, pero por completitud)
        if (totals.currentAverage >= exemptionThreshold) {
          return { label: "Aprobado (eximido)", color: "#16a34a" };
        }
        
        // Si NO alcanza eximición, debe rendir examen
        // Si el examen ya está rendido, está aprobado
        if (hasExam && examIsRendered) {
          return { label: "Aprobado", color: "#16a34a" };
        }
        
        // En cualquier otro caso donde no alcance eximición, debe rendir examen
        return { label: "Debe rendir examen", color: "#f59e0b" };
      }
      // Si no alcanza ni siquiera aprobación → Reprobado
      return { label: "Reprobado", color: "#ef4444" };
    }
    
    // Durante el semestre (no 100% completo)
    if (totals.currentAverage >= exemptionThreshold) return { label: "Eximición posible", color: "#0ea5e9" };
    if (totals.currentAverage >= passGradeThreshold) {
      // Si hay examen y ya está por encima de aprobación pero por debajo de exención, debe rendir examen
      if (hasExam && totals.currentAverage < exemptionThreshold) {
        return { label: "Debes rendir examen", color: "#f59e0b" };
      }
      return { label: "Vas aprobando", color: "#16a34a" };
    }
    return { label: "Bajo aprobación", color: "#f59e0b" };
  }, [totals, passGradeThreshold, exemptionThreshold, normalizedEvaluations]);

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
  const examEvaluation = useMemo(() => {
    return normalizedEvaluations.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen") || null;
  }, [normalizedEvaluations]);
  const nonExamEvaluations = useMemo(() => {
    return normalizedEvaluations.filter((ev) => String(ev.name || "").trim().toLowerCase() !== "examen");
  }, [normalizedEvaluations]);

  // Calculate total percentage to prevent exceeding 100%
  const calculateTotalPercentage = (evaluations, excludeId = null) => {
    return evaluations.reduce((total, ev) => {
      if (excludeId && ev.id === excludeId) return total;
      return total + (Number(ev.weightPercent) || 0);
    }, 0);
  };

  const updateEvaluation = (id, patch) => {
    // If updating weightPercent, apply different validation based on exam presence
    if (patch.weightPercent !== undefined) {
      const evaluationBeingUpdated = evaluations.find(ev => ev.id === id);
      const isExam = evaluationBeingUpdated && String(evaluationBeingUpdated.name || "").toLowerCase().trim() === "examen";
      const hasExamInList = evaluations.some(ev => String(ev.name || "").toLowerCase().trim() === "examen");
      
      if (hasExamInList) {
        // With exam: different validation
        if (isExam) {
          // Exam can be 20-80%
          const newPercent = Number(patch.weightPercent) || 0;
          patch.weightPercent = clamp(newPercent, 0, 80);
        } else {
          // Non-exam evaluations: no strict 100% validation (they get re-scaled)
          const newPercent = Number(patch.weightPercent) || 0;
          patch.weightPercent = clamp(newPercent, 0, 100);
        }
      } else {
        // Without exam: original validation (total must be ≤ 100%)
        const otherEvaluations = evaluations.filter(ev => ev.id !== id);
        const otherTotal = otherEvaluations.reduce((total, ev) => total + (Number(ev.weightPercent) || 0), 0);
        
        const newPercent = Number(patch.weightPercent) || 0;
        const newTotal = otherTotal + newPercent;
        
        // If exceeds 100%, adjust to maximum allowed
        if (newTotal > 100) {
          const maxAllowed = Math.max(0, 100 - otherTotal);
          patch.weightPercent = maxAllowed;
        }
      }
    }
    
    setEvaluations((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)));
  };

  const addEvaluation = () => {
    // Calculate remaining percentage for new evaluation
    const currentTotal = calculateTotalPercentage(evaluations);
    const remainingPercentage = Math.max(0, 100 - currentTotal);
    const suggestedPercent = remainingPercentage > 0 ? Math.min(25, remainingPercentage) : 0;
    
    const newEvaluation = {
      ...createEmptyEvaluation(),
      weightPercent: suggestedPercent
    };
    
    setEvaluations((prev) => [...prev, newEvaluation]);
  };

  const removeEvaluation = (id) => {
    setEvaluations((prev) => prev.filter((ev) => ev.id !== id));
  };



  // First-time onboarding screen
  if (!isHydrated) {
    return (
      <main>
        <section className="container py-12 sm:py-16">
          <div className="mb-3"><span className="kicker">Calculadora de promedio</span></div>
          <div>
            <h1 className="text-3xl/[1.15] sm:text-4xl/[1.1] font-semibold tracking-tight">Promedio ponderado y nota mínima</h1>
            <p className="mt-3 max-w-[60ch] text-base" style={{ color: "var(--color-text-muted)" }}>
              Cargando...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (isFirstTime) {
    return (
      <main>
        <section className="container py-12 sm:py-16">
          <div className="mb-3"><span className="kicker">Calculadora de promedio</span></div>
          <div>
            <h1 className="text-3xl/[1.15] sm:text-4xl/[1.1] font-semibold tracking-tight">Promedio ponderado y nota mínima</h1>
            <p className="mt-3 max-w-[60ch] text-base" style={{ color: "var(--color-text-muted)" }}>
              Completa tus evaluaciones y mira tu promedio y lo que necesitas para aprobar.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 max-w-4xl">
            {/* Quick Start with Example */}
            <div className="card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Comenzar con ejemplo</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Prueba la calculadora con datos de ejemplo para ver cómo funciona. Incluye evaluaciones ya completadas y pendientes.
                  </p>
                  <div className="mt-4">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={startWithExample}
                    >
                      Ver ejemplo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Start from Scratch */}
            <div className="card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Empezar desde cero</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Configura tu curso paso a paso. Agrega tus evaluaciones, porcentajes y notas para calcular tu promedio.
                  </p>
                  <div className="mt-4">
                    <button 
                      type="button" 
                      className="btn btn-ghost"
                      onClick={startFromScratch}
                    >
                      Comenzar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features preview */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-4xl">
            <div className="text-center">
              <div className="inline-flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-3">
                <span className="text-lg">📊</span>
              </div>
              <h4 className="font-medium">Promedio automático</h4>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Calcula tu promedio ponderado al instante
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-3">
                <span className="text-lg">🎯</span>
              </div>
              <h4 className="font-medium">Nota mínima</h4>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Sabe qué nota necesitas para aprobar
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-3">
                <span className="text-lg">💾</span>
              </div>
              <h4 className="font-medium">Se guarda automático</h4>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Tus datos se guardan en tu navegador
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Function to calculate summary stats for all courses
  const getCourseSummary = (course) => {
    const normalizedEvs = course.evaluations?.map((ev) => {
      const weight = clamp(Number(ev.weightPercent) || 0, 0, 100);
      const raw = Number(ev.grade);
      const gradeValue = !raw || raw < 1 ? null : clamp(raw, 1.0, 7.0);
      return { ...ev, weightPercent: weight, gradeValue };
    }) || [];

    // Calculate totals using same logic as main component
    const examIndex = normalizedEvs.findIndex((ev) => String(ev.name || "").trim().toLowerCase() === "examen");
    const hasExam = examIndex !== -1;
    const examWeight = hasExam ? (Number(normalizedEvs[examIndex].weightPercent) || 0) : 0;
    const nonExam = normalizedEvs.filter((_, idx) => idx !== examIndex);

    let completedWeight = 0;
    let weightedSum = 0;
    let currentAverage = null;

    if (hasExam) {
      // Chilean system logic
      const remainingWeight = Math.max(0, 100 - examWeight);
      
      let nonExamSum = 0;
      let nonExamCount = 0;
      nonExam.forEach((ev) => {
        if (ev.gradeValue != null) {
          nonExamSum += ev.gradeValue;
          nonExamCount++;
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
      
      currentAverage = completedWeight > 0 ? (weightedSum / (completedWeight / 100)) : null;
    } else {
      // Without exam logic
      normalizedEvs.forEach((ev) => {
        const weight = Number(ev.weightPercent) || 0;
        if (ev.gradeValue != null) {
          completedWeight += weight;
          weightedSum += (ev.gradeValue * weight) / 100;
        }
      });
      
      currentAverage = completedWeight > 0 ? (weightedSum / (completedWeight / 100)) : null;
    }

    // Determine status based purely on accumulated score and remaining requirements
    let status = { label: "Sin evaluar", color: "#64748b" };
    if (completedWeight > 0 && weightedSum >= 0) {
      const passThreshold = course.passGradeThreshold ?? 4.0;
      const exemptionThreshold = course.exemptionThreshold ?? 5.5;
      
      const examEval = normalizedEvs.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen");
      const examIsRendered = examEval && examEval.gradeValue != null;
      const isFinalState = Math.round(completedWeight) >= 100 || (hasExam && examIsRendered);
      
      if (isFinalState) {
        // Final state: use actual average
        if (currentAverage >= exemptionThreshold) {
          status = { label: "Aprobado (eximido)", color: "#16a34a" };
        } else if (currentAverage >= passThreshold) {
          // Si alcanza la eximición, se eximió (esto ya se verificó arriba, pero por completitud)
          if (currentAverage >= exemptionThreshold) {
            status = { label: "Aprobado (eximido)", color: "#16a34a" };
          }
          // Si el examen ya está rendido, está aprobado
          else if (hasExam && examIsRendered) {
            status = { label: "Aprobado", color: "#16a34a" };
          }
          // En cualquier otro caso donde no alcance eximición, debe rendir examen
          else {
            status = { label: "Debe rendir examen", color: "#f59e0b" };
          }
        } else {
          status = { label: "Reprobado", color: "#ef4444" };
        }
      } else {
        // In progress: calculate what average is needed in remaining evaluations
        const remainingWeight = Math.max(0, 100 - completedWeight);
        
        if (remainingWeight === 0) {
          status = { label: "Completado", color: "#64748b" };
        } else {
          const remainingWeightDecimal = remainingWeight / 100;
          
          // Calculate required average for passing
          const pointsNeededToPass = passThreshold - weightedSum;
          const avgNeededToPass = pointsNeededToPass / remainingWeightDecimal;
          
          // Calculate required average for exemption
          const pointsNeededToExempt = exemptionThreshold - weightedSum;
          const avgNeededToExempt = pointsNeededToExempt / remainingWeightDecimal;
          
          // Determine status based on what's mathematically possible
          if (weightedSum >= exemptionThreshold) {
            status = { label: "Ya eximido", color: "#16a34a" };
          } else if (weightedSum >= passThreshold) {
            status = { label: "Debe rendir examen", color: "#f59e0b" };
          } else if (avgNeededToExempt <= 6.0) {
            // Can still exempt with reasonable effort
            status = { label: "Eximición posible", color: "#0ea5e9" };
          } else if (avgNeededToPass <= 6.0) {
            // Can approve with reasonable effort
            status = { label: "Vas aprobando", color: "#16a34a" };
          } else if (avgNeededToPass <= 7.0) {
            // Can approve but needs maximum effort
            status = { label: "Puedes aprobar", color: "#f59e0b" };
          } else {
            // Mathematically impossible to approve
            status = { label: "Difícil aprobar", color: "#ef4444" };
          }
        }
      }
    }

    // Calculate what's needed for status info
    let requiredInfo = null;
    if (completedWeight > 0 && completedWeight < 100) {
      const remainingWeight = Math.max(0, 100 - completedWeight);
      const remainingWeightDecimal = remainingWeight / 100;
      const passThreshold = course.passGradeThreshold ?? 4.0;
      
      // Only show requirements if not already passing
      if (weightedSum < passThreshold) {
        const pointsNeededToPass = passThreshold - weightedSum;
        const avgNeededToPass = pointsNeededToPass / remainingWeightDecimal;
        
        if (avgNeededToPass > 0 && avgNeededToPass <= 7.0) {
          requiredInfo = {
            avgNeeded: avgNeededToPass,
            remainingWeight: remainingWeight,
            purpose: "para aprobar"
          };
        }
      } else {
        // Already passing, check exemption
        const exemptionThreshold = course.exemptionThreshold ?? 5.5;
        if (weightedSum < exemptionThreshold) {
          const pointsNeededToExempt = exemptionThreshold - weightedSum;
          const avgNeededToExempt = pointsNeededToExempt / remainingWeightDecimal;
          
          if (avgNeededToExempt > 0 && avgNeededToExempt <= 7.0) {
            requiredInfo = {
              avgNeeded: avgNeededToExempt,
              remainingWeight: remainingWeight,
              purpose: "para eximirse"
            };
          }
        }
      }
    }

    return {
      currentAverage,
      accumulatedScore: completedWeight > 0 ? weightedSum : null,
      completedWeight,
      status,
      totalEvaluations: normalizedEvs.length,
      completedEvaluations: normalizedEvs.filter(ev => ev.gradeValue != null).length,
      requiredInfo
    };
  };

  return (
    <main>
      <section className="container py-12 sm:py-16">
        <div className="mb-3"><span className="kicker">Calculadora de promedio</span></div>
        <div>
          <h1 className="text-3xl/[1.15] sm:text-4xl/[1.1] font-semibold tracking-tight">Promedio ponderado y nota mínima</h1>
          <p className="mt-3 max-w-[60ch] text-base" style={{ color: "var(--color-text-muted)" }}>
            Completa tus evaluaciones y mira tu promedio y lo que necesitas para aprobar.
          </p>
        </div>

        {/* Course Summary Cards */}
        {isHydrated && courses.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Puntaje acumulado por ramo</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => {
                const summary = getCourseSummary(course);
                const isCurrentCourse = course.id === selectedCourseId;
                
                return (
                  <div 
                    key={course.id}
                    className={`card p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isCurrentCourse ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectCourse(course.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-sm truncate" title={course.name}>
                        {course.name || "Curso"}
                      </h3>
                      {isCurrentCourse && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                          Seleccionado
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                            Puntaje Acumulado
                          </span>
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ 
                              backgroundColor: summary.status.color + '20', 
                              color: summary.status.color,
                              border: `1px solid ${summary.status.color}40`
                            }}
                          >
                            {summary.status.label}
                          </span>
                        </div>
                        <div className="text-3xl font-bold">
                          {summary.accumulatedScore != null ? formatNumber(summary.accumulatedScore, 2) : '—'}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        <span>
                          {summary.completedEvaluations}/{summary.totalEvaluations} evaluaciones
                        </span>
                        <span>
                          {formatNumber(summary.completedWeight, 0)}% completo
                        </span>
                      </div>
                      
                      {summary.completedWeight > 0 && summary.completedWeight < 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(summary.completedWeight, 100)}%` }}
                          />
                        </div>
                      )}
                      
                      {summary.accumulatedScore != null && (
                        <div className="text-xs text-center mt-2 space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                          <div>
                            Suma de contribuciones ponderadas ({summary.completedEvaluations} evaluacion{summary.completedEvaluations !== 1 ? 'es' : ''})
                          </div>
                          {summary.requiredInfo && (
                            <div className="font-medium" style={{ color: 'var(--color-text)' }}>
                              Necesitas promedio {formatNumber(summary.requiredInfo.avgNeeded, 1)} en el {formatNumber(summary.requiredInfo.remainingWeight, 0)}% restante {summary.requiredInfo.purpose}
                            </div>
                          )}
                          {summary.currentAverage != null && (
                            <div className="text-xs opacity-75">
                              Promedio proyectado: {formatNumber(summary.currentAverage, 1)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {/* Form */}
          <div className="order-2 lg:order-1 lg:col-span-2 card p-5 sm:p-6">
            <div className="flex flex-col gap-3">
              {/* Header with course selector always visible */}
              <div className="flex flex-col gap-3">
                {/* Course selector row - always visible */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-base font-semibold">
                    {courses.find(c => c.id === selectedCourseId)?.name || "Mi Curso"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium" htmlFor="course-select">Curso:</label>
                      <select
                        id="course-select"
                        className={`border rounded-md px-3 py-2 ${courses.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        value={selectedCourseId || (courses[0]?.id || "")}
                        onChange={(e) => handleSelectCourse(e.target.value)}
                        disabled={courses.length === 0}
                        title={courses.length === 0 ? 'No hay cursos disponibles. Crea uno primero.' : 'Seleccionar curso'}
                      >
                        {courses.length === 0 && <option value="">Sin cursos disponibles</option>}
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.name || "Curso"}</option>
                        ))}
                      </select>
                    </div>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowCourseManagement(!showCourseManagement)}>
                      <span className="mr-1">⚙️</span>
                      Gestionar cursos
                    </button>
                  </div>
                </div>
                
                {/* Course management buttons - only when expanded */}
                {showCourseManagement && (
                  <div className="flex flex-wrap items-center justify-end gap-2 p-3 bg-gray-50 rounded border">
                    <span className="text-sm text-gray-600 mr-2">Acciones del curso:</span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={handleAddCourse}>
                      <span className="mr-1">➕</span>Nuevo curso
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={handleRenameCourse}>
                      <span className="mr-1">✏️</span>Renombrar
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={handleDeleteCourse}>
                      <span className="mr-1">🗑️</span>Eliminar
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowCourseManagement(false)} title="Cerrar gestión">
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {!isHydrated && (
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Cargando datos…
                </div>
              )}

              {/* Percentage validation feedback */}
              {(nonExamEvaluations.length > 0 || examEvaluation) && (() => {
                if (examEvaluation) {
                  // With exam: show different logic
                  const examWeight = Number(examEvaluation.weightPercent) || 0;
                  const nonExamTotal = nonExamEvaluations.reduce((sum, ev) => sum + (Number(ev.weightPercent) || 0), 0);
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
                } else {
                  // Without exam: original validation logic
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
                        <p className="text-xs mt-1 text-red-600">
                          Ajusta los porcentajes para que sumen exactamente 100%
                        </p>
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
                }
                
                return null;
              })()}



              {/* Enhanced empty state */}
              {nonExamEvaluations.length === 0 && !examEvaluation ? (
                // Check if we need to create a course first
                !selectedCourseId || courses.length === 0 ? (
                  <div className="mt-4 text-center py-12">
                    <div className="inline-flex w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">¡Primero creemos un curso!</h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                      Necesitas crear un curso antes de poder agregar evaluaciones. Cada curso mantiene sus evaluaciones independientemente.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button type="button" className="btn btn-primary" onClick={handleAddCourse}>
                        <span className="mr-1">➕</span>
                        Crear mi primer curso
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={startWithExample}>
                        Ver ejemplo
                      </button>
                    </div>
                    <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
                      💡 Tip: Puedes renombrar el curso después y crear múltiples cursos si los necesitas.
                    </p>
                  </div>
                ) : (
                  // Normal empty state for when course exists but no evaluations
                  <div className="mt-4 text-center py-12">
                    <div className="inline-flex w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">¡Comencemos con tus evaluaciones!</h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                      Comienza agregando las evaluaciones de tu semestre (pruebas, tareas, proyectos) para calcular tu promedio y saber qué necesitas para aprobar.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button type="button" className="btn btn-primary" onClick={addEvaluation}>
                        Agregar primera evaluación
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={startWithExample}>
                        Ver ejemplo
                      </button>
                    </div>
                    <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
                      💡 Tip: Agrega primero las evaluaciones del semestre. El examen final se puede agregar después.
                    </p>
                  </div>
                )
              ) : (
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ color: 'var(--color-text-muted)' }}>
                        <th className="text-left font-medium py-2">Evaluación</th>
                        <th className="text-left font-medium py-2">Porcentaje (%)</th>
                        <th className="text-left font-medium py-2">Nota (1.0–7.0)</th>
                        <th className="text-right font-medium py-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                    {nonExamEvaluations.map((ev) => {
                      const isInvalid = ev.grade !== "" && Number(ev.grade) > 0 && (Number(ev.grade) < 1 || Number(ev.grade) > 7);
                      return (
                        <tr key={ev.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                          <td className="py-3 pr-3 min-w-[200px]">
                            <input
                              type="text"
                              className="w-full border rounded-md px-3 py-2"
                              value={ev.name}
                              onChange={(e) => updateEvaluation(ev.id, { name: e.target.value })}
                            />
                          </td>
                          <td className="py-3 pr-3 w-[140px]">
                            {(() => {
                              const hasExamInList = evaluations.some(e => String(e.name || "").toLowerCase().trim() === "examen");
                              
                              if (hasExamInList) {
                                // With exam: simplified validation (no 100% restriction)
                                return (
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="w-full border rounded-md px-3 py-2"
                                    value={String(ev.weightPercent ?? '')}
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
                                );
                              } else {
                                // Without exam: original validation logic
                                const currentTotal = calculateTotalPercentage(evaluations, ev.id);
                                const remaining = 100 - currentTotal;
                                const currentValue = Number(ev.weightPercent) || 0;
                                const maxPossible = currentValue + remaining;
                                const isOverLimit = currentTotal + currentValue > 100;
                                
                                return (
                                  <div className="relative">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className={`w-full border rounded-md px-3 py-2 ${isOverLimit ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                      value={String(ev.weightPercent ?? '')}
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
                                      placeholder={remaining > 0 ? `Máx: ${Math.min(25, remaining)}` : '0'}
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
                                );
                              }
                            })()}
                          </td>
                          <td className="py-3 pr-3 w-[160px]">
                            <input
                              type="text"
                              inputMode="decimal"
                              className="w-full border rounded-md px-3 py-2"
                              value={String(ev.grade ?? '')}
                              onChange={(e) => {
                                const v = sanitizeDecimalInput(e.target.value);
                                updateEvaluation(ev.id, { grade: v });
                              }}
                              onBlur={(e) => {
                                const raw = sanitizeDecimalInput(e.target.value);
                                if (raw === '' || Number(raw) === 0) return;
                                const num = Number(raw);
                                const fixed = clamp(isNaN(num) ? 0 : num, 1.0, 7.0);
                                updateEvaluation(ev.id, { grade: fixed });
                              }}
                              style={isInvalid ? { borderColor: 'var(--color-danger)' } : undefined}
                            />
                          </td>
                          <td className="py-3 text-right">
                            <button type="button" className="btn btn-ghost" onClick={() => removeEvaluation(ev.id)}>Eliminar</button>
                          </td>
                        </tr>
                      );
                    })}
                                      </tbody>
                  </table>
                </div>
              )}

              {/* Action buttons for when evaluations exist */}
              {(nonExamEvaluations.length > 0 || examEvaluation) && (
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    type="button" 
                    className={`btn btn-primary ${!selectedCourseId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={selectedCourseId ? addEvaluation : undefined}
                    disabled={!selectedCourseId}
                    title={!selectedCourseId ? 'Primero debes seleccionar o crear un curso' : 'Agregar nueva evaluación'}
                  >
                    Agregar evaluación
                  </button>
                  {!hasExam && nonExamEvaluations.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>o</span>
                      <button 
                        type="button" 
                        className={`btn btn-ghost ${!selectedCourseId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={selectedCourseId ? handleAddExam : undefined}
                        disabled={!selectedCourseId}
                        title={!selectedCourseId ? 'Primero debes seleccionar o crear un curso' : 'El examen se agrega independientemente. Las otras evaluaciones se re-escalan automáticamente.'}
                      >
                        <span className="mr-1">📝</span>
                        Agregar examen final (opcional)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Exam section - moved to the bottom as it happens at the end of semester */}
              {examEvaluation && (
                <div className="mt-6 border-t pt-6">
                  <div className="card p-5 sm:p-6" style={{ borderColor: 'var(--color-warning)', backgroundColor: '#fefbf3' }}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        Examen Final
                        <span className="badge" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>
                          Final del semestre
                        </span>
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
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Porcentaje del examen (%)</label>
                        <div className="relative">
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
                            title="Peso del examen final (recomendado 20-50%)"
                          />
                          <p className="text-xs mt-1 text-gray-600">
                            Rango recomendado: 20% - 50%
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-2">
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
                              placeholder="Deja vacío si no lo has rendido"
                            />
                          );
                        })()}
                      </div>
                    </div>
                    {(() => {
                      const examPending = !examEvaluation.grade || Number(examEvaluation.grade) < 1;
                      const examEff = Number(totals.examWeight) || 0;
                      if (!examPending || examEff <= 0) return null;
                      // Con examen: la contribución actual de las evaluaciones no-examen es
                      // promedio(no-examen) × (100 - pesoExamen) / 100
                      const remainingForNonExam = Math.max(0, 100 - examEff);
                      const nonExamAvg = Number(totals.nonExamAverage) || 0;
                      const hasNonExamGraded = Number(totals.nonExamCount) > 0;
                      const currentWithoutExam = hasNonExamGraded ? (nonExamAvg * remainingForNonExam) / 100 : 0;
                      const needed = (passGradeThreshold - currentWithoutExam) / (examEff / 100);
                      const clampedNeeded = clamp(needed, 1.0, 7.0);
                      return (
                        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm font-medium text-blue-800">💡 Nota necesaria en el examen:</p>
                          <p className="text-sm text-blue-700 mt-1">
                            {needed > 7.0
                              ? 'Con el examen solo no es posible aprobar. Necesitas mejorar otras evaluaciones.'
                              : `Para aprobar el curso necesitas aproximadamente nota ${formatNumber(clampedNeeded, 1)} en el examen final.`}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Advanced options - only show if there are evaluations */}
              {(nonExamEvaluations.length > 0 || examEvaluation) && (
                <div className="mt-2">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowAdvanced((v) => !v)}>
                    {showAdvanced ? 'Ocultar configuración avanzada' : 'Configuración avanzada'}
                  </button>
                  {showAdvanced && (
                    <div className="mt-3 grid gap-4 sm:grid-cols-3">
                      <div className="card p-4">
                        <p className="text-sm font-medium flex items-center gap-2">
                          Exigencia (% para nota 4.0)
                          <span className="text-xs text-gray-400" title="Porcentaje de puntaje necesario para obtener nota 4.0">ℹ️</span>
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <input
                            type="text"
                            inputMode="numeric"
                            className="w-28 border rounded-md px-3 py-2"
                            value={String(exigenciaPercent ?? '')}
                            onChange={(e) => {
                              const v = sanitizeIntegerInput(e.target.value);
                              setExigenciaPercent(v === '' ? '' : v);
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
                            {[60, 70].map((preset) => (
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
                          Aprobación (nota mínima)
                          <span className="text-xs text-gray-400" title="Nota mínima necesaria para aprobar el curso">ℹ️</span>
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <input
                            type="text"
                            inputMode="decimal"
                            className="w-28 border rounded-md px-3 py-2"
                            value={String(passGradeThreshold ?? '')}
                            onChange={(e) => {
                              const v = sanitizeDecimalInput(e.target.value);
                              setPassGradeThreshold(v === '' ? '' : v);
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
                            {[4.0, 4.5].map((preset) => (
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
                            value={String(exemptionThreshold ?? '')}
                            onChange={(e) => {
                              const v = sanitizeDecimalInput(e.target.value);
                              setExemptionThreshold(v === '' ? '' : v);
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
              )}
            </div>
          </div>

          {/* Enhanced Result Panel */}
          <div className="order-1 lg:order-2 card p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-base font-semibold flex items-center gap-2">
              Tu promedio actual
              {totals.currentAverage != null && (
                <span className="text-xs px-2 py-1 rounded-full" style={{ 
                  backgroundColor: status.color + '20', 
                  color: status.color,
                  border: `1px solid ${status.color}40`
                }}>
                  {status.label}
                </span>
              )}
            </h2>
            
            <div className="mt-4 grid gap-4">
              {/* Main average display */}
              <div className="text-center">
                <p className="text-4xl font-semibold tracking-tight">
                  {totals.currentAverage != null ? formatNumber(totals.currentAverage, 1) : '—'}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                  Progreso: {formatNumber(totals.completedWeight, 0)}% completado
                </p>
                {totals.completedWeight > 0 && totals.completedWeight < 100 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(totals.completedWeight, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Requirements card - only show if exam is not rendered and not all completed */}
              {(() => {
                const examEval = normalizedEvaluations.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen");
                const examIsRendered = examEval && examEval.gradeValue != null;
                const hasExam = totals.hasExam;
                const remainingWeight = Math.max(0, 100 - totals.completedWeight);
                
                // Don't show requirements card if exam is already rendered
                if (hasExam && examIsRendered) return null;
                
                // Don't show if all evaluations are completed (without exam)
                if (remainingWeight === 0 && !hasExam) return null;
                
                // Determine current status for exemption
                const currentAvg = totals.currentAverage;
                const canExempt = currentAvg != null && currentAvg >= exemptionThreshold;
                const canPass = currentAvg != null && currentAvg >= passGradeThreshold;
                const mustTakeExam = canPass && !canExempt && hasExam;
                
                return (
                  <div className="card p-4 border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-blue-700">
                      {mustTakeExam ? '📝 Estado de exención' : '🎯 Para poder rendir examen'}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                      {(() => {
                        const need = neededForPass;
                        
                        if (remainingWeight === 0) {
                          if (totals.currentAverage != null) {
                            if (totals.currentAverage >= exemptionThreshold) {
                              return 'Ya te eximiste del examen 🎉';
                            }
                            if (totals.currentAverage >= passGradeThreshold) {
                              return 'Debes rendir examen para aprobar 📝';
                            }
                            return 'No alcanzas la nota mínima para aprobar ❌';
                          }
                          return 'No quedan evaluaciones pendientes';
                        }
                        
                        // Durante el semestre - mostrar explícitamente el estado de exención
                        if (mustTakeExam) {
                          const needForExemption = neededForExemption;
                          if (needForExemption != null && !isNaN(needForExemption) && needForExemption <= 7.0) {
                            return `Con tu promedio actual (${formatNumber(currentAvg, 1)}) debes rendir examen. Necesitas promedio ${formatNumber(needForExemption, 1)} en el ${formatNumber(remainingWeight, 0)}% restante para eximirte.`;
                          } else {
                            return `Con tu promedio actual (${formatNumber(currentAvg, 1)}) debes rendir examen. Ya no es posible eximirse con las evaluaciones restantes.`;
                          }
                        }
                        
                        if (need == null || isNaN(need)) return 'Agrega evaluaciones para ver qué necesitas';
                        if (need > 7.0) return 'No es posible aprobar con lo que queda ⚠️';
                        if (need <= 1.0) return 'Ya aseguras poder rendir examen 🎉';
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

                    {/* Cuando debe rendir examen y aún no ingresa su nota, mostrar nota mínima requerida en el examen */}
                    {mustTakeExam && hasExam && !examIsRendered && (() => {
                      const examEff = Number(totals.examWeight) || 0;
                      if (examEff <= 0) return null;
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
                );
              })()}

              {/* Success state - only show when truly approved (exempted) */}
              {totals.completedWeight >= 100 && totals.currentAverage != null && totals.currentAverage >= exemptionThreshold && (
                <div className="card p-4 border-l-4 border-green-500 bg-green-50">
                  <p className="text-sm font-medium text-green-700">🎉 ¡Felicitaciones!</p>
                  <p className="text-sm mt-1 text-green-600">
                    Has aprobado el curso y te eximiste del examen final
                  </p>
                </div>
              )}

              {/* Exam required state */}
              {(() => {
                const examEval = normalizedEvaluations.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen");
                const examIsRendered = examEval && examEval.gradeValue != null;
                const hasExam = totals.hasExam;
                
                // Show "must take exam" if completed, reaches pass threshold but not exemption, and exam not yet rendered
                if (totals.completedWeight >= 100 && totals.currentAverage != null && 
                    totals.currentAverage >= passGradeThreshold && totals.currentAverage < exemptionThreshold &&
                    (!hasExam || !examIsRendered)) {
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
                        const currentWithoutExam = hasNonExamGraded ? (nonExamAvg * remainingForNonExam) / 100 : 0;
                        const needed = (passGradeThreshold - currentWithoutExam) / (examEff / 100);
                        const clampedNeeded = clamp(needed, 1.0, 7.0);
                        return (
                          <p className="text-sm mt-2 text-yellow-700">
                            {needed > 7.0
                              ? 'Con el examen solo no es posible aprobar. Necesitas más que un 7.0.'
                              : `Para aprobar necesitas aproximadamente nota ${formatNumber(clampedNeeded, 1)} en el examen final.`}
                          </p>
                        );
                      })()}
                      {!hasExam && (
                        <p className="text-xs mt-2" style={{ color: '#92400e' }}>
                          Agrega el examen final para calcular la nota mínima necesaria.
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Final result cards for when exam is rendered */}
              {(() => {
                const examEval = normalizedEvaluations.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen");
                const examIsRendered = examEval && examEval.gradeValue != null;
                const hasExam = totals.hasExam;
                
                // Show final result card only if exam is rendered and we have a final average
                if (hasExam && examIsRendered && totals.currentAverage != null) {
                  if (totals.currentAverage >= exemptionThreshold) {
                    return (
                      <div className="card p-4 border-l-4 border-green-500 bg-green-50">
                        <p className="text-sm font-medium text-green-700">🎉 Curso Aprobado (Eximido)</p>
                        <p className="text-sm mt-1 text-green-600">
                          Promedio final: {formatNumber(totals.currentAverage, 1)} - Has aprobado con eximición del examen
                        </p>
                      </div>
                    );
                  } else if (totals.currentAverage >= passGradeThreshold) {
                    return (
                      <div className="card p-4 border-l-4 border-green-500 bg-green-50">
                        <p className="text-sm font-medium text-green-700">🎉 Curso Aprobado</p>
                        <p className="text-sm mt-1 text-green-600">
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

              {/* Failed state (only for non-exam cases or incomplete scenarios) */}
              {(() => {
                const examEval = normalizedEvaluations.find((ev) => String(ev.name || "").trim().toLowerCase() === "examen");
                const examIsRendered = examEval && examEval.gradeValue != null;
                const hasExam = totals.hasExam;
                
                // Only show this for non-exam scenarios or when exam is not rendered
                if (totals.completedWeight >= 100 && totals.currentAverage != null && 
                    totals.currentAverage < passGradeThreshold && (!hasExam || !examIsRendered)) {
                  return (
                    <div className="card p-4 border-l-4 border-red-500 bg-red-50">
                      <p className="text-sm font-medium text-red-700">❌ Reprobado</p>
                      <p className="text-sm mt-1 text-red-600">
                        Tu promedio de {formatNumber(totals.currentAverage, 1)} no alcanza la nota mínima para aprobar ({formatNumber(passGradeThreshold, 1)})
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Optimistic scenario */}
              {totals.remainingWeight > 0 && (
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">
                    Si te sacas 7.0 en todo lo que queda: <span className="font-medium">{formatNumber(totals.finalIfAllSevens, 1)}</span>
                  </p>
                </div>
              )}

              {/* Scale explanation */}
              <div className="text-center">
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Escala: {exigenciaPercent}% = 4.0 · 100% = 7.0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Backup and Data Management Section */}
        {isHydrated && !isFirstTime && (
          <div className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-center mb-8">
              {!showBackupSection ? (
                <div>
                  <button 
                    type="button" 
                    className="btn btn-ghost text-sm"
                    onClick={() => setShowBackupSection(true)}
                  >
                    <span className="mr-2">💾</span>
                    Ver opciones de backup y datos
                  </button>
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                    Descarga, importa o gestiona tus datos guardados
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold">Backup y gestión de datos</h3>
                    <button 
                      type="button" 
                      className="btn btn-ghost text-sm"
                      onClick={() => setShowBackupSection(false)}
                      title="Ocultar esta sección"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
                    Tus datos se guardan automáticamente en tu navegador. Puedes hacer backup o transferir tus cursos entre dispositivos.
                  </p>
                </div>
              )}
            </div>
            
            {showBackupSection && (
              <>
                <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                  {/* Export Section */}
                  <div className="card p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">💾</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Descargar backup</h4>
                        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                          Descarga un archivo JSON con todos tus cursos y evaluaciones. Útil para hacer respaldo o transferir a otro dispositivo.
                        </p>
                        <button type="button" className="btn btn-primary" onClick={handleExport}>
                          <span className="mr-2">⬇️</span>
                          Descargar mis datos
                        </button>
                        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                          Se descargará un archivo .json con fecha y hora
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Import Section */}
                  <div className="card p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">📂</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Cargar backup</h4>
                        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                          Restaura tus cursos desde un archivo de backup. Esto <strong>reemplazará</strong> todos tus datos actuales.
                        </p>
                        <button type="button" className="btn btn-ghost" onClick={handleOpenImport}>
                          <span className="mr-2">⬆️</span>
                          Cargar desde archivo
                        </button>
                        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                          Acepta archivos .json descargados de esta app
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional info */}
                <div className="mt-8 max-w-2xl mx-auto">
                  <div className="card p-4" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span>ℹ️</span>
                      ¿Cómo funcionan mis datos?
                    </h5>
                    <div className="text-xs space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                      <p>• Todos tus cursos y evaluaciones se guardan automáticamente en tu navegador</p>
                      <p>• Los datos solo están en tu dispositivo, no los enviamos a servidores</p>
                      <p>• Si borras los datos del navegador, perderás la información</p>
                      <p>• Usa el backup para guardar una copia de seguridad o transferir entre dispositivos</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
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


