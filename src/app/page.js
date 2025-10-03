export const metadata = {
  title: "Nota Mínima - Calculadora de Notas Chilena | Sistema 1.0-7.0",
  description:
    "Calculadora profesional de notas para estudiantes chilenos. Calcula promedios ponderados, convierte puntajes a escala 1.0-7.0 y obtén información completa del sistema educativo.",
  keywords: "calculadora notas chile, promedio ponderado, escala 1.0 7.0, sistema educativo chileno, estudiantes universidad, nota minima, conversion puntaje nota",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nota Mínima - Calculadora de Notas Chilena | Precisa y Profesional",
    description:
      "La herramienta más completa para estudiantes chilenos. Tres calculadoras especializadas para promedios, conversiones y sistema de notas 1.0-7.0.",
    type: "website",
    locale: "es_CL",
    url: "https://notaminima.cl/",
    siteName: "Nota Mínima",
    images: [
      {
        url: "https://notaminima.cl/logo-256.png",
        width: 256,
        height: 256,
        alt: "Nota Mínima - Calculadora profesional de notas chilena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nota Mínima - Calculadora de Notas Chilena | Sistema 1.0-7.0",
    description:
      "Calculadora profesional para estudiantes chilenos. Promedios ponderados, conversiones y sistema educativo completo.",
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
  const features = [
    {
      title: "Cálculo preciso",
      description: "Algoritmos exactos para el sistema educativo chileno",
    },
    {
      title: "Sin registro",
      description: "Tus datos se guardan localmente en tu dispositivo",
    },
    {
      title: "Completamente gratis",
      description: "Sin anuncios ni costos ocultos",
    },
  ];

  const tools = [
    {
      title: "Promedio Ponderado",
      description: "Calcula promedios con diferentes ponderaciones por evaluación",
      href: "/promedio",
      primary: true,
    },
    {
      title: "Puntaje a Nota",
      description: "Convierte puntajes numéricos a escala 1.0-7.0",
      href: "/puntaje-a-nota",
      primary: false,
    },
  ];

  return (
    <>
      <main>
        <section
          className="hero-bg"
          style={{ minHeight: "90vh", display: "flex", alignItems: "center" }}
          aria-label="Calculadora de notas chilena"
        >
          <div className="container py-32 sm:py-40">
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-10">
                <span className="kicker">Plataforma Educativa Profesional</span>
              </div>
              <h1 className="text-6xl/[1.05] sm:text-7xl/[1.03] font-bold tracking-tight mb-8">
                Calculadora de Notas
                <span className="block text-5xl sm:text-6xl text-blue-600 mt-3 font-extrabold">
                  Sistema Chileno 1.0-7.0
                </span>
              </h1>
              <p className="mt-8 max-w-3xl mx-auto text-xl leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                La herramienta más avanzada y precisa para estudiantes chilenos. Calcula promedios ponderados
                y convierte puntajes con cualquier exigencia del sistema educativo nacional.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/promedio"
                  className="btn btn-primary px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  aria-label="Ir a la calculadora de promedio ponderado"
                >
                  Comenzar Ahora
                </Link>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Cálculos Precisos</h3>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Algoritmos exactos para el sistema educativo chileno
                  </p>
                </div>

                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">100% Seguro</h3>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Datos guardados localmente, sin registro requerido
                  </p>
                </div>

                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Completamente Gratis</h3>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Sin anuncios, sin costos ocultos, siempre gratuito
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30" aria-label="Herramientas disponibles">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Herramientas Profesionales</h2>
              <p className="text-xl leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Dos herramientas especializadas para diferentes necesidades académicas,
                diseñadas específicamente para el sistema educativo chileno con precisión milimétrica.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto">
              {tools.map((tool, index) => (
                <div key={tool.title} className="card p-10 flex flex-col h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                      tool.primary ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-slate-600 to-slate-700'
                    }`}>
                      {index + 1}
                    </div>
                    {tool.primary && (
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 font-medium rounded-full text-sm border border-blue-200">
                        Más Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{tool.title}</h3>
                  <p className="text-lg flex-1 leading-relaxed mb-8" style={{ color: "var(--color-text-muted)" }}>
                    {tool.description}
                  </p>
                  <Link
                    href={tool.href}
                    className={`btn mt-auto text-center py-4 px-8 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                      tool.primary
                        ? 'btn-primary shadow-lg hover:shadow-xl'
                        : 'btn-ghost border-2 hover:bg-gray-50'
                    }`}
                    aria-label={`Ir a ${tool.title}`}
                  >
                    {tool.primary ? 'Comenzar' : 'Explorar'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24" aria-label="Características principales">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 tracking-tight">Por qué elegir Nota Mínima</h2>
                <p className="text-xl leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  Diseñada específicamente para estudiantes chilenos con las características que realmente necesitas
                  para tener éxito académico.
                </p>
              </div>
              <div className="grid gap-12 md:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.title} className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Nota Mínima - Calculadora de Notas Chilena",
            "alternateName": "Calculadora Educativa para Sistema 1.0-7.0",
            "url": "https://notaminima.cl",
            "description": "Plataforma educativa profesional para estudiantes chilenos. Dos herramientas especializadas: calculadora de promedios ponderados y conversor de puntajes a escala 1.0-7.0.",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web Browser",
            "inLanguage": "es-CL",
            "audience": {
              "@type": "EducationalAudience",
              "educationalRole": "student",
              "audienceType": "university students, college students, high school students"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CLP"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Nota Mínima",
              "url": "https://notaminima.cl",
              "description": "Plataforma educativa especializada en el sistema de notas chileno"
            },
            "featureList": [
              "Calculadora de promedio ponderado con múltiples evaluaciones",
              "Conversor preciso de puntaje a nota 1.0-7.0",
              "Almacenamiento local de datos sin registro",
              "Interfaz profesional y fácil de usar",
              "Cálculos exactos según estándares educativos",
              "Compatible con todos los dispositivos"
            ],
            "screenshot": "https://notaminima.cl/logo-256.png",
            "softwareVersion": "2.0",
            "dateModified": "2025-01-15",
            "isAccessibleForFree": true,
            "educationalUse": "calculation, learning, assessment",
            "educationalLevel": "secondary education, higher education",
            "learningResourceType": "educational software"
          })
        }}
      />
    </>
  );
}
