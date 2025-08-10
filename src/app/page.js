export const metadata = {
  title: "Calculadora de Notas 1.0–7.0 (Chile) | Promedio, Nota Mínima, Puntaje→Nota",
  description:
    "Calcula promedios, nota mínima para aprobar o eximir y convierte puntaje a nota con exigencia (60%, 70%). Gratis y sin registro.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Calculadora de Notas 1.0–7.0 (Chile) | Promedio, Nota Mínima, Puntaje→Nota",
    description:
      "Calcula promedios, nota mínima para aprobar o eximir y convierte puntaje a nota con exigencia.",
    type: "website",
    locale: "es_CL",
    url: "https://notaminima.cl/",
    siteName: "Nota Mínima",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Notas 1.0–7.0 (Chile) | Promedio, Nota Mínima, Puntaje→Nota",
    description:
      "Calcula promedios, nota mínima y convierte puntaje a nota con exigencia.",
  },
};

import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-bg">
        <div className="container py-14 sm:py-20">
          <div className="mb-4">
            <span className="kicker">Gratis y sin registro</span>
          </div>
          <h1 className="text-4xl/[1.1] sm:text-5xl/[1.05] font-semibold tracking-tight">
            Calculadora de Notas 1.0–7.0 para Chile
          </h1>
          <p className="mt-4 max-w-[62ch] text-base" style={{ color: 'var(--color-text-muted)' }}>
            Calcula <strong>promedios</strong>, encuentra tu <strong>nota mínima</strong> para aprobar o eximir y
            convierte <strong>puntaje → nota</strong> con exigencia 60%/70%.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/promedio" className="btn btn-primary">Usar calculadora</Link>
            <Link href="/promedio" className="btn btn-ghost">Calcular promedio</Link>
            <Link href="/promedio" className="btn btn-ghost">Buscar nota mínima</Link>
            <Link href="/puntaje-a-nota" className="btn btn-ghost">Puntaje → Nota</Link>
          </div>

          {/* Preview card */}
          <div className="mt-10 card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Resultado de ejemplo</p>
                <p className="mt-1 text-lg font-medium">
                  Promedio: <span className="text-emerald-600">5.3</span>
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Necesitas <span className="font-semibold">4.1</span> en el examen para aprobar.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="badge">Exigencia 60%</span>
                <span className="badge">Escala 1.0–7.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="container py-8 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="card p-5 hover:shadow-md transition-transform hover:-translate-y-0.5">
            <h3 className="text-base font-semibold">Calcular promedio</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Ingresa evaluaciones con su peso y obtén tu promedio al instante.
            </p>
            <div className="mt-4"><Link href="/promedio" className="btn btn-primary">Empezar</Link></div>
          </article>
          <article className="card p-5 hover:shadow-md transition-transform hover:-translate-y-0.5">
            <h3 className="text-base font-semibold">Buscar nota mínima</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Descubre cuánto necesitas en lo que falta para aprobar o eximir.
            </p>
            <div className="mt-4"><Link href="/promedio" className="btn btn-primary">Calcular</Link></div>
          </article>
          <article className="card p-5 hover:shadow-md transition-transform hover:-translate-y-0.5">
            <h3 className="text-base font-semibold">Puntaje → Nota</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Convierte X/Y puntos a nota 1.0–7.0 con exigencia 60%/70%.
            </p>
            <div className="mt-4"><Link href="/puntaje-a-nota" className="btn btn-ghost">Abrir conversor</Link></div>
          </article>
        </div>
      </section>

      {/* How it works (compact) */}
      <section className="container py-10 sm:py-14">
        <h2 className="text-xl font-semibold">Cómo funciona</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Tres pasos, sin enredos.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="badge">1) Agrega evaluaciones</span>
          <span className="badge">2) Ajusta escala</span>
          <span className="badge">3) Ve tu mínimo</span>
        </div>

        <details className="mt-4">
          <summary className="text-sm font-medium cursor-pointer select-none">Ver detalles</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <article className="card p-5">
              <h3 className="text-base font-semibold">1) Agrega tus evaluaciones</h3>
              <ul className="mt-2 text-sm list-checks" style={{ color: 'var(--color-text-muted)' }}>
                <li>Nombre, fecha (opcional) y peso %</li>
                <li>Nota 1.0–7.0 o puntos X/Y</li>
              </ul>
            </article>
            <article className="card p-5">
              <h3 className="text-base font-semibold">2) Ajusta la escala</h3>
              <ul className="mt-2 text-sm list-checks" style={{ color: 'var(--color-text-muted)' }}>
                <li>60/90/100 puntos o personalizado</li>
                <li>Exigencia 60% o 70%</li>
              </ul>
            </article>
            <article className="card p-5">
              <h3 className="text-base font-semibold">3) Mira lo que necesitas</h3>
              <ul className="mt-2 text-sm list-checks" style={{ color: 'var(--color-text-muted)' }}>
                <li>Promedio y estado (aprobado/eximido)</li>
                <li>Nota mínima para aprobar</li>
              </ul>
            </article>
          </div>
        </details>
      </section>

      {/* Feature highlights */}
      <section className="container py-4 sm:py-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="card p-5">
            <h3 className="text-base font-semibold">Rápido y claro</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Edita pesos, notas o puntos y ve el resultado al instante.
            </p>
          </article>
          <article className="card p-5">
            <h3 className="text-base font-semibold">Escala con exigencia</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Convierte X/Y puntos a nota 1.0–7.0 con exigencia 60%/70%.
            </p>
          </article>
          <article className="card p-5">
            <h3 className="text-base font-semibold">Reglas transparentes</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Aprobación, eximición y mínimo de examen, sin fórmulas raras.
            </p>
          </article>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="container py-10 sm:py-14">
        <div className="card p-6 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <h2 className="text-xl font-semibold">Preguntas frecuentes</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Respuestas rápidas a dudas comunes.
              </p>
            </div>
            <ul className="sm:col-span-2 grid gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <li>¿Cómo se calcula la nota mínima con una exigencia del 60%?</li>
              <li>¿Qué significa eximirse del examen?</li>
              <li>¿Cómo convertir puntos a nota en una prueba de 60/90/100?</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="empezar" className="container py-10 sm:py-16">
        <div className="card p-6 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Empieza en segundos</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Calcula promedios, nota mínima y conviertes puntaje a nota sin registrarte.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/promedio" className="btn btn-primary">Abrir calculadora</Link>
              <Link href="/puntaje-a-nota" className="btn btn-ghost">Puntaje → Nota</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
