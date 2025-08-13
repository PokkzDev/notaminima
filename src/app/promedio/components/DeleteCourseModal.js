"use client";

export default function DeleteCourseModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div role="dialog" aria-modal="true" className="relative card w-[min(92vw,460px)] p-5 sm:p-6">
        <h3 className="text-base font-semibold">Eliminar curso</h3>
        <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          ¿Seguro que quieres eliminar este curso? Esta acción no se puede deshacer.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}


