"use client";

import { useEffect, useState } from "react";
import RenameCourseModal from "./components/RenameCourseModal";
import CreateCourseModal from "./components/CreateCourseModal";
import DeleteCourseModal from "./components/DeleteCourseModal";
import ImportBackupModal from "./components/ImportBackupModal";
import CourseSummaryGrid from "./components/CourseSummaryGrid";
import CourseHeader from "./components/CourseHeader";
import PercentageFeedback from "./components/PercentageFeedback";
import EvaluationsTable from "./components/EvaluationsTable";
import ExamSection from "./components/ExamSection";
import ResultPanel from "./components/ResultPanel";
import AdvancedOptions from "./components/AdvancedOptions";
import BackupSection from "./components/BackupSection";
import EmptyState from "./components/EmptyState";
import FormActions from "./components/FormActions";
import LoadingState from "./components/LoadingState";
import FirstTimeOnboarding from "./components/FirstTimeOnboarding";
import { clamp, createEmptyEvaluation, createDefaultCourseData } from "./utils";
import { calculateTotalPercentage } from "./calculations";
import { useAverageData } from "./hooks/useAverageData";
import { useBackup } from "./hooks/useBackup";

export default function ClientAverageCalculatorPage() {
  // Course management

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
  // const [currentStep, setCurrentStep] = useState(0); // Removed: onboarding steps not used

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
    // setCurrentStep(0);
    
    // Update the current course with example data
    setCourses((prev) => prev.map((c) => (
      c.id === selectedCourseId
        ? { ...c, evaluations: exampleEvaluations }
        : c
    )));
  };

  const startFromScratch = () => {
    setIsFirstTime(false);
    // setCurrentStep(0);
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

  // Derived data about evaluations and totals
  const {
    normalizedEvaluations,
    totals,
    neededForPass,
    neededForExemption,
    nextEvaluationRequirement,
    status,
    examEvaluation,
    nonExamEvaluations,
  } = useAverageData(evaluations, passGradeThreshold, exemptionThreshold);
  const hasExam = totals.hasExam;

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

  // Export / Import (backup) via hook
  const {
    handleExport,
    isImportOpen,
    setIsImportOpen,
    importError,
    importData,
    handleOpenImport,
    handleFileChosen,
    performImport,
  } = useBackup({
    courses,
    selectedCourseId,
    setCourses,
    setSelectedCourseId,
    setEvaluations,
    setExigenciaPercent,
    setPassGradeThreshold,
    setExemptionThreshold,
  });

  // moved to calculations via useAverageData

  // moved to calculations

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
  if (!isHydrated) return <LoadingState />;

  if (isFirstTime) return (
    <FirstTimeOnboarding
      onStartWithExample={startWithExample}
      onStartFromScratch={startFromScratch}
    />
  );

  // getCourseSummary moved to CourseSummaryGrid/calculations

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
          <CourseSummaryGrid
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={handleSelectCourse}
          />
        )}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {/* Form */}
          <div className="order-2 lg:order-1 lg:col-span-2 card p-5 sm:p-6">
            <div className="flex flex-col gap-3">
              {/* Header with course selector always visible */}
              <CourseHeader
                courses={courses}
                selectedCourseId={selectedCourseId}
                onSelectCourse={handleSelectCourse}
                showCourseManagement={showCourseManagement}
                setShowCourseManagement={setShowCourseManagement}
                onAddCourse={handleAddCourse}
                onRenameCourse={handleRenameCourse}
                onDeleteCourse={handleDeleteCourse}
              />

              {!isHydrated && (
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Cargando datos…
                </div>
              )}

              {/* Percentage validation feedback */}
              <PercentageFeedback
                examEvaluation={examEvaluation}
                nonExamEvaluations={nonExamEvaluations}
                evaluations={evaluations}
              />



              {/* Enhanced empty state */}
              {nonExamEvaluations.length === 0 && !examEvaluation ? (
                <EmptyState
                  hasCourse={!!selectedCourseId && courses.length > 0}
                  onCreateCourse={handleAddCourse}
                  onAddEvaluation={addEvaluation}
                  onStartWithExample={startWithExample}
                />
              ) : (
                <EvaluationsTable
                  evaluations={evaluations}
                  normalizedEvaluations={nonExamEvaluations}
                  updateEvaluation={updateEvaluation}
                  removeEvaluation={removeEvaluation}
                />
              )}

              {/* Action buttons for when evaluations exist */}
              {(nonExamEvaluations.length > 0 || examEvaluation) && (
                <FormActions
                  canAdd={!!selectedCourseId}
                  onAddEvaluation={addEvaluation}
                  showAddExam={!hasExam && nonExamEvaluations.length > 0}
                  onAddExam={handleAddExam}
                />
              )}

              <ExamSection
                examEvaluation={examEvaluation}
                totals={totals}
                updateEvaluation={updateEvaluation}
                removeEvaluation={removeEvaluation}
                passGradeThreshold={passGradeThreshold}
              />

              <AdvancedOptions
                show={showAdvanced}
                onToggle={() => setShowAdvanced((v) => !v)}
                hasEvaluations={nonExamEvaluations.length > 0 || !!examEvaluation}
                exigenciaPercent={exigenciaPercent}
                setExigenciaPercent={setExigenciaPercent}
                passGradeThreshold={passGradeThreshold}
                setPassGradeThreshold={setPassGradeThreshold}
                exemptionThreshold={exemptionThreshold}
                setExemptionThreshold={setExemptionThreshold}
              />
            </div>
          </div>

          {/* Enhanced Result Panel */}
          <ResultPanel
            totals={totals}
            status={status}
            normalizedEvaluations={normalizedEvaluations}
            exemptionThreshold={exemptionThreshold}
            passGradeThreshold={passGradeThreshold}
            neededForPass={neededForPass}
            neededForExemption={neededForExemption}
            nextEvaluationRequirement={nextEvaluationRequirement}
            exigenciaPercent={exigenciaPercent}
          />
        </div>

        {/* Backup and Data Management Section */}
        {isHydrated && !isFirstTime && (
          <BackupSection
            open={showBackupSection}
            onToggle={setShowBackupSection}
            onExport={handleExport}
            onOpenImport={handleOpenImport}
          />
        )}
      </section>

      {/* Modals */}
      <RenameCourseModal
        open={isRenameOpen}
        value={renameInputValue}
        onChange={setRenameInputValue}
        onCancel={() => setIsRenameOpen(false)}
        onConfirm={performRenameCourse}
      />
      <CreateCourseModal
        open={isCreateOpen}
        value={createInputValue}
        onChange={setCreateInputValue}
        onCancel={() => setIsCreateOpen(false)}
        onConfirm={performCreateCourse}
      />
      <DeleteCourseModal
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={performDeleteCourse}
      />
      <ImportBackupModal
        open={isImportOpen}
        importError={importError}
        hasData={importData ? importData.courses.length : 0}
        onFileChosen={(file) => handleFileChosen(file)}
        onCancel={() => setIsImportOpen(false)}
        onConfirm={performImport}
      />
    </main>
  );
}


