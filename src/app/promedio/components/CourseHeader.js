"use client";

import styles from "../Promedio.module.css";

export default function CourseHeader({
  courses,
  selectedCourseId,
  onSelectCourse,
  showCourseManagement,
  setShowCourseManagement,
  onAddCourse,
  onRenameCourse,
  onDeleteCourse,
}) {
  return (
    <div className={styles.courseSection}>
      {/* Course selector row - always visible */}
      <div className={styles.courseSelector}>
        <h2 className="text-base font-semibold">
          {courses.find((c) => c.id === selectedCourseId)?.name || "Mi Curso"}
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className={styles.courseSelectorLabel} htmlFor="course-select">
              Curso:
            </label>
            <select
              id="course-select"
              className={`${styles.courseSelect} ${
                courses.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              value={selectedCourseId || (courses[0]?.id || "")}
              onChange={(e) => onSelectCourse(e.target.value)}
              disabled={courses.length === 0}
              title={
                courses.length === 0
                  ? "No hay cursos disponibles. Crea uno primero."
                  : "Seleccionar curso"
              }
            >
              {courses.length === 0 && (
                <option value="">Sin cursos disponibles</option>
              )}
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || "Curso"}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowCourseManagement(!showCourseManagement)}
          >
            <span className="mr-1">⚙️</span>
            Gestionar cursos
          </button>
        </div>
      </div>

      {/* Course management buttons - only when expanded */}
      {showCourseManagement && (
        <div className={styles.courseActions}>
          <span className="text-sm text-gray-600 mr-2">Acciones del curso:</span>
          <button type="button" className={styles.courseActionBtn} onClick={onAddCourse}>
            <span className="mr-1">➕</span>
            Nuevo curso
          </button>
          <button type="button" className={styles.courseActionBtn} onClick={onRenameCourse}>
            <span className="mr-1">✏️</span>
            Renombrar
          </button>
          <button type="button" className={styles.courseActionBtn} onClick={onDeleteCourse}>
            <span className="mr-1">🗑️</span>
            Eliminar
          </button>
          <button
            type="button"
            className={styles.courseActionBtn}
            onClick={() => setShowCourseManagement(false)}
            title="Cerrar gestión"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}


