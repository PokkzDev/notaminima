"use client";

export default function CreateCourseModal({ open, value, onChange, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div role="dialog" aria-modal="true" className="relative card w-[min(92vw,480px)] p-5 sm:p-6">
        <h3 className="text-base font-semibold">Nuevo curso</h3>
        <div className="mt-3 grid gap-2">
          <label className="text-sm font-medium" htmlFor="create-input">Nombre</label>
          <input
            id="create-input"
            autoFocus
            className="w-full border rounded-md px-3 py-2"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(); }}
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>Crear</button>
        </div>
      </div>
    </div>
  );
}


