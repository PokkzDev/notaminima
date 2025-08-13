"use client";

export default function ImportBackupModal({ open, importError, hasData, onFileChosen, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div role="dialog" aria-modal="true" className="relative card w-[min(92vw,520px)] p-5 sm:p-6">
        <h3 className="text-base font-semibold">Cargar backup</h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Selecciona un archivo JSON exportado desde esta página para restaurar tus cursos y evaluaciones.
        </p>
        <div className="mt-4">
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => onFileChosen(e.target.files && e.target.files[0])}
          />
        </div>
        {importError && (
          <p className="mt-3 text-sm" style={{ color: 'var(--color-danger)' }}>{importError}</p>
        )}
        {hasData && (
          <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Se encontró {hasData} curso(s). Al confirmar, reemplazarán tus datos actuales.
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={!hasData}>Importar</button>
        </div>
      </div>
    </div>
  );
}


