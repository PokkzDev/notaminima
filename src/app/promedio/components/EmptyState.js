"use client";

export default function EmptyState({
  hasCourse,
  onCreateCourse,
  onAddEvaluation,
  onStartWithExample,
}) {
  if (!hasCourse) {
    return (
      <div className="mt-4 text-center py-12">
        <div className="inline-flex w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4">
          <span className="text-2xl">🎓</span>
        </div>
        <h3 className="text-lg font-medium mb-2">¡Primero creemos un curso!</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Necesitas crear un curso antes de poder agregar evaluaciones. Cada curso mantiene sus evaluaciones independientemente.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button type="button" className="btn btn-primary" onClick={onCreateCourse}>
            <span className="mr-1">➕</span>
            Crear mi primer curso
          </button>
          <button type="button" className="btn btn-ghost" onClick={onStartWithExample}>
            Ver ejemplo
          </button>
        </div>
        <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
          💡 Tip: Puedes renombrar el curso después y crear múltiples cursos si los necesitas.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 text-center py-12">
      <div className="inline-flex w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
        <span className="text-2xl">📝</span>
      </div>
      <h3 className="text-lg font-medium mb-2">¡Comencemos con tus evaluaciones!</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Comienza agregando las evaluaciones de tu semestre (pruebas, tareas, proyectos) para calcular tu promedio y saber qué necesitas para aprobar.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button type="button" className="btn btn-primary" onClick={onAddEvaluation}>
          Agregar primera evaluación
        </button>
        <button type="button" className="btn btn-ghost" onClick={onStartWithExample}>
          Ver ejemplo
        </button>
      </div>
      <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
        💡 Tip: Agrega primero las evaluaciones del semestre. El examen final se puede agregar después.
      </p>
    </div>
  );
}


