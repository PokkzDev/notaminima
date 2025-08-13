"use client";

export default function LoadingState() {
  return (
    <main>
      <section className="container py-12 sm:py-16">
        <div className="mb-3"><span className="kicker">Calculadora de promedio</span></div>
        <div>
          <h1 className="text-3xl/[1.15] sm:text-4xl/[1.1] font-semibold tracking-tight">Promedio ponderado y nota mínima</h1>
          <p className="mt-3 max-w-[60ch] text-base" style={{ color: "var(--color-text-muted)" }}>
            Cargando...
          </p>
        </div>
      </section>
    </main>
  );
}


