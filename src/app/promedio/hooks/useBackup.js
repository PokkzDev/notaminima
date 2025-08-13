"use client";

import { useState } from "react";

export function useBackup({
  courses,
  selectedCourseId,
  setCourses,
  setSelectedCourseId,
  setEvaluations,
  setExigenciaPercent,
  setPassGradeThreshold,
  setExemptionThreshold,
}) {
  const handleExport = () => {
    try {
      const payload = { courses, selectedCourseId };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
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
    if (data && Array.isArray(data.courses)) {
      return {
        courses: data.courses,
        selectedCourseId: data.selectedCourseId || data.courses[0]?.id || "",
      };
    }
    if (data && Array.isArray(data.evaluations)) {
      const migrated = {
        id:
          globalThis.crypto &&
          typeof globalThis.crypto.randomUUID === "function"
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
        setImportError(
          "Archivo inválido. Asegúrate de seleccionar un backup exportado por la app."
        );
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
      const current =
        importData.courses.find((c) => c.id === importData.selectedCourseId) ||
        importData.courses[0];
      if (current) {
        setEvaluations(current.evaluations || []);
        setExigenciaPercent(current.exigenciaPercent ?? 60);
        setPassGradeThreshold(current.passGradeThreshold ?? 4.0);
        setExemptionThreshold(current.exemptionThreshold ?? 5.5);
      }
    } catch {}
    setIsImportOpen(false);
  };

  return {
    handleExport,
    isImportOpen,
    setIsImportOpen,
    importError,
    importData,
    handleOpenImport,
    handleFileChosen,
    performImport,
  };
}


