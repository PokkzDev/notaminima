"use client";

export default function BackupSection({
  open,
  onToggle,
  onExport,
  onOpenImport,
}) {
  return (
    <div className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
      <div className="text-center mb-8">
        {!open ? (
          <div>
            <button type="button" className="btn btn-ghost text-sm" onClick={() => onToggle(true)}>
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
              <button type="button" className="btn btn-ghost text-sm" onClick={() => onToggle(false)} title="Ocultar esta sección">
                ✕
              </button>
            </div>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
              Tus datos se guardan automáticamente en tu navegador. Puedes hacer backup o transferir tus cursos entre dispositivos.
            </p>
          </div>
        )}
      </div>

      {open && (
        <>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
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
                  <button type="button" className="btn btn-primary" onClick={onExport}>
                    <span className="mr-2">⬇️</span>
                    Descargar mis datos
                  </button>
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                    Se descargará un archivo .json con fecha y hora
                  </p>
                </div>
              </div>
            </div>

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
                  <button type="button" className="btn btn-ghost" onClick={onOpenImport}>
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
  );
}


