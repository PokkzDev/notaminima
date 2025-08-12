export const metadata = {
  title: "Calculadora de Notas 1.0–7.0 (Chile) | Promedio, Nota Mínima, Puntaje→Nota",
  description:
    "✅ Calcula promedios ponderados, nota mínima para aprobar o eximir y convierte puntaje a nota con exigencia (60%, 70%). Gratis, sin registro y optimizado para estudiantes chilenos.",
  keywords: "calculadora notas chile, promedio ponderado, nota minima aprobar, puntaje a nota, escala 1.0 7.0, exigencia 60%, universidad chile, instituto chile, estudiantes chile",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "🎓 Calculadora de Notas Chile | Promedio y Puntaje a Nota 1.0-7.0",
    description:
      "Herramienta gratuita para estudiantes chilenos. Calcula promedios ponderados, nota mínima para aprobar y convierte puntajes a notas.",
    type: "website",
    locale: "es_CL",
    url: "https://notaminima.cl/",
    siteName: "Nota Mínima",
    images: [
      {
        url: "https://notaminima.cl/logo-256.png",
        width: 256,
        height: 256,
        alt: "Nota Mínima - Calculadora de notas Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🎓 Calculadora de Notas Chile | Promedio y Puntaje a Nota 1.0-7.0",
    description:
      "Herramienta gratuita para estudiantes chilenos. Calcula promedios, nota mínima y convierte puntajes a notas.",
    images: ["https://notaminima.cl/logo-256.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        {/* Hero optimizado para SEO */}
        <section className="hero-bg" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }} aria-label="Sección principal de la calculadora de notas">
          <div className="container py-24 sm:py-36">
            <div className="mb-6">
              <span className="kicker">Chile · 1.0–7.0</span>
            </div>
            <h1 className="text-5xl/[1.05] sm:text-6xl/[1.03] font-semibold tracking-tight">
              Calculadora de Notas Chile
              <span className="block text-3xl sm:text-4xl mt-2" style={{ color: 'var(--color-text-muted)' }}>
                Promedio Ponderado y Nota Mínima
              </span>
            </h1>
            <p className="mt-6 max-w-[70ch] text-lg" style={{ color: 'var(--color-text-muted)' }}>
              <strong>Herramienta gratuita</strong> para estudiantes chilenos. Calcula tu promedio ponderado, 
              encuentra la nota mínima para aprobar o eximirte, y convierte puntajes a notas en escala 1.0-7.0.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/promedio" className="btn btn-primary" aria-label="Abrir calculadora de promedio ponderado">
                📊 Calcular Promedio
              </Link>
              <Link href="/puntaje-a-nota" className="btn btn-ghost" aria-label="Convertir puntaje a nota chilena">
                🧮 Puntaje → Nota
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <span className="badge">✅ Sin registro</span>
              <span className="badge">💾 Guarda localmente</span>
              <span className="badge">🇨🇱 Escala chilena</span>
              <span className="badge">📱 Mobile-friendly</span>
            </div>
          </div>
        </section>

        {/* Sección de herramientas principales */}
        <section className="container py-16" aria-label="Herramientas principales disponibles">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">🎓 Herramientas para Estudiantes Chilenos</h2>
            <p className="text-lg max-w-[80ch] mx-auto" style={{ color: 'var(--color-text-muted)' }}>
              Todo lo que necesitas para gestionar tus notas en el sistema educativo chileno.
              Compatible con universidades, institutos y colegios.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article className="card p-6 hover:shadow-lg transition-shadow" aria-label="Calculadora de promedio ponderado">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Calculadora de Promedio</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Calcula tu promedio ponderado con evaluaciones de diferentes porcentajes. 
                Descubre cuánto necesitas para aprobar o eximirte del examen final.
              </p>
              <ul className="text-sm mb-4 space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                <li>• Promedio ponderado automático</li>
                <li>• Nota mínima para aprobar (4.0)</li>
                <li>• Gestión de múltiples cursos</li>
                <li>• Backup de datos local</li>
              </ul>
              <Link href="/promedio" className="btn btn-primary btn-sm" aria-label="Usar calculadora de promedio">
                Usar Calculadora
              </Link>
            </article>

            <article className="card p-6 hover:shadow-lg transition-shadow" aria-label="Conversor de puntaje a nota">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="text-xl font-semibold mb-3">Puntaje → Nota</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Convierte cualquier puntaje (X/Y puntos) a nota chilena 1.0-7.0. 
                Configura la exigencia (60%, 70%) según tu institución.
              </p>
              <ul className="text-sm mb-4 space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                <li>• Conversión X/Y puntos a nota</li>
                <li>• Exigencia configurable</li>
                <li>• Presets comunes (60, 90, 100 pts)</li>
                <li>• Fórmula chilena oficial</li>
              </ul>
              <Link href="/puntaje-a-nota" className="btn btn-primary btn-sm" aria-label="Usar conversor de puntaje">
                Convertir Puntaje
              </Link>
            </article>

            <article className="card p-6 hover:shadow-lg transition-shadow" aria-label="Centro de ayuda y FAQ">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-3">Centro de Ayuda</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Resuelve tus dudas sobre el sistema de notas chileno, aprende a usar las herramientas 
                y encuentra ejemplos prácticos paso a paso.
              </p>
              <ul className="text-sm mb-4 space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                <li>• Preguntas frecuentes (FAQ)</li>
                <li>• Ejemplos paso a paso</li>
                <li>• Tips y estrategias</li>
                <li>• Soporte técnico</li>
              </ul>
              <Link href="/faq" className="btn btn-primary btn-sm" aria-label="Ir al centro de ayuda">
                Ver FAQ
              </Link>
            </article>
          </div>
        </section>

        {/* Sección de características */}
        <section className="container py-16 border-t border-[var(--color-border)]" aria-label="Características principales">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">🚀 ¿Por qué elegir Nota Mínima?</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">100% Privado</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Tus datos se guardan solo en tu dispositivo. Sin cuentas ni rastreo.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Súper Rápido</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Cálculos instantáneos y interfaz optimizada para móviles.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🇨🇱</div>
              <h3 className="font-semibold mb-2">100% Chileno</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Diseñado específicamente para el sistema educativo chileno.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold mb-2">Completamente Gratis</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Sin pagos, sin suscripciones, sin límites de uso.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Structured Data para la página principal */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Nota Mínima - Calculadora de Notas Chile",
            "alternateName": "Calculadora de Promedio Ponderado Chile",
            "url": "https://notaminima.cl",
            "description": "Calculadora gratuita de notas para estudiantes chilenos. Calcula promedios ponderados, nota mínima para aprobar y convierte puntajes a notas en escala 1.0-7.0",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web Browser",
            "inLanguage": "es-CL",
            "audience": {
              "@type": "EducationalAudience",
              "educationalRole": "student"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CLP"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Nota Mínima",
              "url": "https://notaminima.cl"
            },
            "featureList": [
              "Calculadora de promedio ponderado",
              "Conversor de puntaje a nota",
              "Gestión de múltiples cursos",
              "Almacenamiento local de datos",
              "Escala chilena 1.0-7.0",
              "Exigencia configurable (60%, 70%)",
              "Compatible con móviles"
            ],
            "screenshot": "https://notaminima.cl/logo-256.png",
            "softwareVersion": "1.0",
            "dateModified": "2025-01-15",
            "isAccessibleForFree": true,
            "educationalUse": "assignment",
            "educationalLevel": "higher education",
            "learningResourceType": "tool"
          })
        }}
      />
    </>
  );
}
