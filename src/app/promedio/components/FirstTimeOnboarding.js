"use client";

export default function FirstTimeOnboarding({ onStartWithExample, onStartFromScratch }) {
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

        <div className="mt-12 grid gap-6 lg:grid-cols-2 max-w-4xl">
          <div className="card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Comenzar con ejemplo</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Prueba la calculadora con datos de ejemplo para ver cómo funciona. Incluye evaluaciones ya completadas y pendientes.
                </p>
                <div className="mt-4">
                  <button type="button" className="btn btn-primary" onClick={onStartWithExample}>
                    Ver ejemplo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Empezar desde cero</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Configura tu curso paso a paso. Agrega tus evaluaciones, porcentajes y notas para calcular tu promedio.
                </p>
                <div className="mt-4">
                  <button type="button" className="btn btn-ghost" onClick={onStartFromScratch}>
                    Comenzar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-4xl">
          <div className="text-center">
            <div className="inline-flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-3">
              <span className="text-lg">📊</span>
            </div>
            <h4 className="font-medium">Promedio automático</h4>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              Calcula tu promedio ponderado al instante
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-3">
              <span className="text-lg">🎯</span>
            </div>
            <h4 className="font-medium">Nota mínima</h4>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              Sabe qué nota necesitas para aprobar
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-3">
              <span className="text-lg">💾</span>
            </div>
            <h4 className="font-medium">Se guarda automático</h4>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              Tus datos se guardan en tu navegador
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


