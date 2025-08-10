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
      {/* Hero minimalista */}
      <section className="hero-bg" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div className="container py-24 sm:py-36">
          <div className="mb-6">
            <span className="kicker">Chile · 1.0–7.0</span>
          </div>
          <h1 className="text-5xl/[1.05] sm:text-6xl/[1.03] font-semibold tracking-tight">
            Calculadora de Nota Mínima
          </h1>
          <p className="mt-3 max-w-[60ch] text-base" style={{ color: 'var(--color-text-muted)' }}>
            Promedio ponderado y cuánto necesitas para aprobar. Gratis.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/promedio" className="btn btn-primary">Abrir calculadora</Link>
            <Link href="/puntaje-a-nota" className="btn btn-ghost">Puntaje → Nota</Link>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span className="badge">Sin registro</span>
            <span className="badge">Guarda tus datos</span>
          </div>
        </div>
      </section>
    </main>
  );
}
