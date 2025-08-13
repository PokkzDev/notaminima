"use client";

import { formatNumber } from "../utils";
import { getCourseSummary } from "../calculations";

export default function CourseSummaryGrid({ courses, selectedCourseId, onSelectCourse }) {
  if (!Array.isArray(courses) || courses.length === 0) return null;
  return (
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
                isCurrentCourse ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => onSelectCourse(course.id)}
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
                    <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                      Puntaje Acumulado
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: summary.status.color + "20",
                        color: summary.status.color,
                        border: `1px solid ${summary.status.color}40`,
                      }}
                    >
                      {summary.status.label}
                    </span>
                  </div>
                  <div className="text-3xl font-bold">
                    {summary.accumulatedScore != null ? formatNumber(summary.accumulatedScore, 2) : "—"}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
                  <span>
                    {summary.completedEvaluations}/{summary.totalEvaluations} evaluaciones
                  </span>
                  <span>{formatNumber(summary.completedWeight, 0)}% completo</span>
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
                  <div className="text-xs text-center mt-2 space-y-1" style={{ color: "var(--color-text-muted)" }}>
                    <div>
                      Suma de contribuciones ponderadas ({summary.completedEvaluations} evaluacion
                      {summary.completedEvaluations !== 1 ? "es" : ""})
                    </div>
                    {summary.requiredInfo && (
                      <div className="font-medium" style={{ color: "var(--color-text)" }}>
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
  );
}


