export const metadata = {
  title: "🇨🇱 Sistema de Notas Chile 1.0-7.0 | Guía Completa Escala Chilena Educación",
  description:
    "📚 Guía completa del sistema de notas chileno: escala 1.0-7.0, exigencia 60%-70%, cálculo de promedios en universidades, institutos y colegios de Chile. Con ejemplos prácticos.",
  keywords: "sistema notas chile, escala 1.0 7.0, educacion chilena, universidades chile, institutos chile, colegios chile, exigencia 60% 70%, promedio ponderado universidad",
  alternates: { canonical: "/sistema-notas-chile" },
  openGraph: {
    title: "🇨🇱 Sistema de Notas Chile | Guía Completa Escala 1.0-7.0",
    description:
      "Todo sobre el sistema educativo chileno: escalas de notas, exigencias, promedios y ejemplos prácticos para estudiantes.",
    type: "article",
    locale: "es_CL",
    url: "https://notaminima.cl/sistema-notas-chile",
    siteName: "Nota Mínima",
    images: [
      {
        url: "https://notaminima.cl/logo-256.png",
        width: 256,
        height: 256,
        alt: "Sistema de Notas Chile - Guía Educativa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🇨🇱 Sistema de Notas Chile | Guía Completa Escala 1.0-7.0",
    description:
      "Guía completa del sistema educativo chileno con ejemplos prácticos para estudiantes.",
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

const chileanInstitutions = [
  "Universidad de Chile", "Pontificia Universidad Católica de Chile", "Universidad de Santiago de Chile",
  "Universidad de Concepción", "Universidad Austral de Chile", "Universidad Católica del Norte",
  "Universidad Federico Santa María", "Universidad de Valparaíso", "Universidad de La Serena",
  "Universidad de Talca", "Universidad de La Frontera", "DUOC UC", "INACAP", "Instituto Profesional AIEP"
];

export default function SistemaNotasChilePage() {
  return (
    <>
      <main>
        {/* Header */}
        <section className="container py-12 sm:py-16">
          <div className="mb-3">
            <span className="kicker">🇨🇱 Educación Chilena</span>
          </div>
          <h1 className="text-3xl/[1.15] sm:text-4xl/[1.1] font-semibold tracking-tight">
            Sistema de Notas en Chile: Guía Completa Escala 1.0-7.0
          </h1>
          <p className="mt-3 max-w-[80ch] text-lg" style={{ color: "var(--color-text-muted)" }}>
            Todo lo que necesitas saber sobre el sistema de evaluación académica en Chile. 
            Desde la escala de notas hasta el cálculo de promedios en universidades e institutos.
          </p>
        </section>

        {/* Escala de notas */}
        <section className="container pb-16">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              📊 La Escala Chilena 1.0-7.0
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-4">Rangos de Calificación</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded border-l-4 border-red-400">
                    <span className="font-medium">1.0 - 3.9</span>
                    <span className="text-red-700 font-semibold">Reprobado ❌</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                    <span className="font-medium">4.0 - 4.9</span>
                    <span className="text-yellow-700 font-semibold">Suficiente ⚠️</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <span className="font-medium">5.0 - 5.9</span>
                    <span className="text-blue-700 font-semibold">Bueno ✅</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                    <span className="font-medium">6.0 - 6.9</span>
                    <span className="text-purple-700 font-semibold">Muy Bueno 🌟</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-400">
                    <span className="font-medium">7.0</span>
                    <span className="text-green-700 font-semibold">Excelente 🏆</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Puntos Clave</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Nota mínima de aprobación:</strong> 4.0</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Nota máxima:</strong> 7.0 (excelencia)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Decimal permitido:</strong> Una cifra (ej: 6.5)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Exigencia común:</strong> 60% para nota 4.0</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>Uso:</strong> Educación Media, Superior y Técnica</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Exigencia académica */}
        <section className="container pb-16">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              🎯 Exigencia Académica en Chile
            </h2>
            
            <p className="mb-6 text-base" style={{ color: "var(--color-text-muted)" }}>
              La exigencia define qué porcentaje del puntaje total corresponde a la nota 4.0 (aprobación).
              Es fundamental para convertir puntajes a notas en el sistema chileno.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="card p-4 bg-blue-50">
                <h3 className="font-semibold text-blue-900 mb-2">Exigencia 60%</h3>
                <p className="text-sm text-blue-800 mb-3">Más común en educación superior</p>
                <div className="text-xs space-y-1">
                  <div>60/100 pts = 4.0</div>
                  <div>36/60 pts = 4.0</div>
                  <div>54/90 pts = 4.0</div>
                </div>
              </div>
              
              <div className="card p-4 bg-orange-50">
                <h3 className="font-semibold text-orange-900 mb-2">Exigencia 70%</h3>
                <p className="text-sm text-orange-800 mb-3">Frecuente en institutos</p>
                <div className="text-xs space-y-1">
                  <div>70/100 pts = 4.0</div>
                  <div>42/60 pts = 4.0</div>
                  <div>63/90 pts = 4.0</div>
                </div>
              </div>
              
              <div className="card p-4 bg-purple-50">
                <h3 className="font-semibold text-purple-900 mb-2">Otras Exigencias</h3>
                <p className="text-sm text-purple-800 mb-3">50%, 65%, 75% según institución</p>
                <div className="text-xs space-y-1">
                  <div>Variable por cátedra</div>
                  <div>Consultar programa</div>
                  <div>Informado al inicio</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instituciones chilenas */}
        <section className="container pb-16">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              🏫 Instituciones Educativas en Chile
            </h2>
            
            <p className="mb-6 text-base" style={{ color: "var(--color-text-muted)" }}>
              El sistema de notas 1.0-7.0 se utiliza en todas las instituciones de educación superior 
              y muchos colegios en Chile. Aquí algunas de las principales:
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chileanInstitutions.map((institution, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                  🎓 {institution}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Cada institución puede tener variaciones en sus sistemas de evaluación, 
                pero la escala 1.0-7.0 es el estándar nacional para la educación superior en Chile.
              </p>
            </div>
          </div>
        </section>

        {/* Herramientas disponibles */}
        <section className="container pb-16">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              🚀 Herramientas para Estudiantes Chilenos
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Link href="/promedio" className="card p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3">Calculadora de Promedio</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Ideal para estudiantes universitarios que necesitan calcular su promedio ponderado 
                  con evaluaciones de diferentes porcentajes.
                </p>
                <div className="text-sm font-medium text-green-600">
                  Usar Calculadora →
                </div>
              </Link>

              <Link href="/puntaje-a-nota" className="card p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🧮</div>
                <h3 className="text-xl font-semibold mb-3">Conversor Puntaje → Nota</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Perfecto para convertir los puntos de pruebas y exámenes a la escala chilena 1.0-7.0 
                  con la exigencia de tu institución.
                </p>
                <div className="text-sm font-medium text-green-600">
                  Convertir Puntajes →
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ rápido */}
        <section className="container pb-16">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6">❓ Preguntas Frecuentes</h2>
            
            <div className="space-y-4">
              <details className="card">
                <summary className="p-4 cursor-pointer font-medium">
                  ¿Por qué se usa la escala 1.0-7.0 en Chile?
                </summary>
                <div className="p-4 border-t text-sm" style={{ color: "var(--color-text-muted)" }}>
                  La escala 1.0-7.0 es un estándar histórico en el sistema educativo chileno que permite 
                  una evaluación más granular que sistemas binarios (aprobado/reprobado) y es compatible 
                  con sistemas internacionales al convertirse fácilmente a porcentajes.
                </div>
              </details>

              <details className="card">
                <summary className="p-4 cursor-pointer font-medium">
                  ¿Qué significa &quot;eximirse&quot; en Chile?
                </summary>
                <div className="p-4 border-t text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Eximirse significa no tener que rendir el examen final al cumplir con un promedio mínimo 
                  (generalmente 5.5 o 6.0) en las evaluaciones previas. Esto es común en universidades chilenas.
                </div>
              </details>

              <details className="card">
                <summary className="p-4 cursor-pointer font-medium">
                  ¿Cómo se relaciona con el sistema internacional?
                </summary>
                <div className="p-4 border-t text-sm" style={{ color: "var(--color-text-muted)" }}>
                  La escala chilena se puede convertir a sistemas internacionales: 7.0 ≈ A+, 6.0-6.9 ≈ A, 
                  5.0-5.9 ≈ B, 4.0-4.9 ≈ C, y bajo 4.0 ≈ F (reprobado).
                </div>
              </details>
            </div>

            <div className="mt-6 text-center">
              <Link href="/faq" className="btn btn-primary">
                Ver Todas las Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Structured Data para página educativa */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Sistema de Notas Chile - Nota Mínima",
            "description": "Guía completa del sistema educativo chileno con escala 1.0-7.0, exigencias académicas y herramientas de cálculo",
            "url": "https://notaminima.cl/sistema-notas-chile",
            "inLanguage": "es-CL",
            "educationalCredentialAwarded": "Información Educativa",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CL"
            },
            "audience": {
              "@type": "EducationalAudience",
              "educationalRole": "student",
              "audienceType": "Estudiantes chilenos"
            },
            "about": {
              "@type": "Thing",
              "name": "Sistema de Notas Chile",
              "description": "Sistema de evaluación académica chileno con escala 1.0-7.0"
            },
            "keywords": "sistema notas chile, escala 1.0-7.0, educación chilena, universidades chile, exigencia académica",
            "mainEntity": {
              "@type": "Article",
              "headline": "Sistema de Notas en Chile: Guía Completa Escala 1.0-7.0",
              "author": {
                "@type": "Organization",
                "name": "Nota Mínima"
              },
              "datePublished": "2025-01-15",
              "dateModified": "2025-01-15"
            }
          })
        }}
      />
    </>
  );
}
