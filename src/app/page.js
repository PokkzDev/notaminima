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

      {/* Secciones inferiores removidas (Cómo funciona, destacados, FAQ preview, CTA) */}
    </main>
  );
}
