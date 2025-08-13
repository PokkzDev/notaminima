"use client";

export default function FormActions({
  canAdd,
  onAddEvaluation,
  showAddExam,
  onAddExam,
}) {
  if (!canAdd) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn btn-primary" onClick={onAddEvaluation}>
        Agregar evaluación
      </button>
      {showAddExam && (
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>o</span>
          <button type="button" className="btn btn-ghost" onClick={onAddExam}>
            <span className="mr-1">📝</span>
            Agregar examen final (opcional)
          </button>
        </div>
      )}
    </div>
  );
}


