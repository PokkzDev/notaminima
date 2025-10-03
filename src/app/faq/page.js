export const metadata = {
  title: "Preguntas Frecuentes (FAQ) | Nota Mínima - Calculadora Notas Chile",
  description:
    "✅ Resuelve todas tus dudas sobre promedio ponderado, nota mínima para aprobar, exigencia 60%/70% y conversión de puntaje a nota en escala chilena 1.0–7.0. Guía completa con ejemplos.",
  keywords: "FAQ calculadora notas, preguntas promedio ponderado, nota minima aprobar chile, exigencia 60% 70%, dudas sistema notas chileno, ayuda calculadora",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ - Calculadora de Notas Chile | Guía Completa Sistema 1.0-7.0",
    description:
      "Guía completa con respuestas a todas las dudas sobre cálculo de promedios, nota mínima y conversión de puntajes en el sistema educativo chileno.",
    type: "article",
    locale: "es_CL",
    url: "https://notaminima.cl/faq",
    siteName: "Nota Mínima",
    images: [
      {
        url: "https://notaminima.cl/logo-256.png",
        width: 256,
        height: 256,
        alt: "FAQ Nota Mínima - Calculadora de notas Chile",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "FAQ - Calculadora de Notas Chile | Guía Completa Sistema 1.0-7.0",
    description:
      "Resuelve todas tus dudas sobre el sistema de notas chileno con ejemplos prácticos.",
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

const faqCategories = [
  {
    id: "promedio",
    title: "📊 Calculadora de Promedio",
    icon: "📊",
    description: "Preguntas sobre cálculo de promedios ponderados",
    questions: [
      {
        q: "¿Cómo calculo mi promedio con evaluaciones que tienen porcentaje distinto?",
        a: (
          <>
            Para un promedio ponderado, multiplica la nota de cada evaluación por su
            porcentaje relativo, suma los resultados y divide por la suma de los porcentajes
            considerados. La <Link href="/promedio" className="underline">calculadora de promedios</Link> hace esto automáticamente.
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
              <p className="text-sm font-medium text-blue-800">💡 Ejemplo práctico:</p>
              <p className="text-sm text-blue-700 mt-1">
                Prueba 1: 6.0 (30%) + Prueba 2: 5.0 (30%) + Examen: 7.0 (40%) = 
                (6.0×0.3 + 5.0×0.3 + 7.0×0.4) = 6.1 promedio final
              </p>
            </div>
          </>
        )
      },
      {
        q: "¿Cómo encuentro la nota mínima que necesito en lo que falta del curso?",
        a: (
          <>
            Ingresa tus evaluaciones ya rendidas y las que faltan con su porcentaje en la
            <Link href="/promedio" className="underline ml-1">calculadora de promedio</Link>.
            La herramienta te mostrará automáticamente cuánto necesitas para alcanzar la aprobación.
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
              <p className="text-sm font-medium text-blue-800">✅ Casos típicos:</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• <strong>Para aprobar:</strong> Promedio mínimo para nota 4.0</li>
                <li>• <strong>Para eximirse:</strong> Promedio para evitar el examen</li>
                <li>• <strong>Próxima evaluación:</strong> Nota específica en la siguiente prueba</li>
              </ul>
            </div>
          </>
        )
      },
      {
        q: "¿Qué pasa si agrego un examen? ¿Cómo se calcula con examen final?",
        a: (
          <>
            En el sistema académico chileno, el examen funciona de manera especial: se calcula el 
            <strong> promedio simple</strong> de todas las evaluaciones regulares, y luego se pondera 
            ese promedio con el peso del examen.
            <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">📝 Ejemplo con examen:</p>
              <p className="text-sm text-yellow-700 mt-1">
                4 evaluaciones con notas 7.0 cada una + Examen 25%:<br/>
                • Promedio evaluaciones = 7.0<br/>
                • Contribución evaluaciones = 7.0 × 75% = 5.25<br/>
                • Si examen = 7.0 → Nota final = 5.25 + 1.75 = 7.0
              </p>
            </div>
          </>
        )
      },
      {
        q: "¿Puedo manejar varios cursos a la vez?",
        a: (
          <>
            Sí, la calculadora incluye un sistema de gestión de cursos. Puedes crear, renombrar 
            y alternar entre múltiples cursos. Cada curso guarda sus evaluaciones independientemente.
            <div className="mt-3 p-3 bg-purple-50 rounded border-l-4 border-purple-200">
              <p className="text-sm font-medium text-purple-800">🎓 Funciones disponibles:</p>
              <ul className="text-sm text-purple-700 mt-1 space-y-1">
                <li>• <strong>Crear nuevo curso:</strong> Botón &quot;Nuevo curso&quot;</li>
                <li>• <strong>Cambiar curso:</strong> Dropdown siempre visible</li>
                <li>• <strong>Backup/Restaurar:</strong> Exportar e importar todos los cursos</li>
              </ul>
            </div>
          </>
        )
      }
    ]
  },
  {
    id: "puntaje",
    title: "🧮 Conversor Puntaje → Nota",
    icon: "🧮",
    description: "Preguntas sobre conversión de puntajes a notas",
    questions: [
      {
        q: "¿Qué es la 'exigencia' 60%/70% y cómo afecta la nota?",
        a: (
          <>
            La exigencia define qué porcentaje del puntaje máximo equivale a la nota
            mínima aprobatoria (4.0). Es el &quot;punto de inflexión&quot; de la escala de notas.
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
              <p className="text-sm font-medium text-blue-800">📏 Comparación de exigencias:</p>
              <div className="text-sm text-blue-700 mt-1 space-y-1">
                <div><strong>60% exigencia:</strong> 36/60 pts = 4.0 (más permisivo)</div>
                <div><strong>70% exigencia:</strong> 42/60 pts = 4.0 (más exigente)</div>
              </div>
            </div>
            Usa el <Link href="/puntaje-a-nota" className="underline">conversor</Link> para probar diferentes exigencias.
          </>
        )
      },
      {
        q: "¿Puedo convertir X/Y puntos a una nota 1.0–7.0 rápidamente?",
        a: (
          <>
            Sí, es muy fácil. El <Link href="/puntaje-a-nota" className="underline">conversor de puntaje → nota</Link> incluye
            ejemplos rápidos de un click y presets para los totales más comunes (50, 60, 70, 90, 100, 120 pts).
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
              <p className="text-sm font-medium text-blue-800">🚀 Uso rápido:</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• <strong>Ejemplos preset:</strong> &quot;Prueba 60 pts&quot;, &quot;Certamen 100 pts&quot;</li>
                <li>• <strong>Totales comunes:</strong> Botones 50, 60, 70, 90, 100, 120</li>
                <li>• <strong>Exigencias típicas:</strong> 50%, 60%, 70%, 80%</li>
              </ul>
            </div>
          </>
        )
      },
      {
        q: "¿Cómo funciona la fórmula de conversión puntaje → nota?",
        a: (
          <>
            La fórmula chilena tiene dos tramos: antes y después del punto de exigencia.
            <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-gray-400">
              <p className="text-sm font-medium text-gray-800">📐 Fórmula matemática:</p>
              <div className="text-sm text-gray-700 mt-1 space-y-2">
                <div><strong>Si % ≤ exigencia:</strong> nota = 1.0 + (% / exigencia) × 3.0</div>
                <div><strong>Si % &gt; exigencia:</strong> nota = 4.0 + ((% - exigencia) / (100 - exigencia)) × 3.0</div>
                <div className="mt-2 text-xs">Esto garantiza que el punto de exigencia = 4.0 y 100% = 7.0</div>
              </div>
            </div>
          </>
        )
      },
      {
        q: "¿Qué puntaje necesito para aprobar con una exigencia X%?",
        a: (
          <>
            Para aprobar (nota 4.0), necesitas exactamente el porcentaje de exigencia del total.
            <div className="mt-3 p-3 bg-orange-50 rounded border-l-4 border-orange-200">
              <p className="text-sm font-medium text-orange-800">🎯 Ejemplos de aprobación:</p>
              <div className="text-sm text-orange-700 mt-1 space-y-1">
                <div><strong>Examen 90 pts, 60% exigencia:</strong> Necesitas 54 pts para 4.0</div>
                <div><strong>Prueba 100 pts, 70% exigencia:</strong> Necesitas 70 pts para 4.0</div>
                <div><strong>Certamen 120 pts, 65% exigencia:</strong> Necesitas 78 pts para 4.0</div>
              </div>
            </div>
          </>
        )
      }
    ]
  },
  {
    id: "general",
    title: "💡 Conceptos Generales",
    icon: "💡", 
    description: "Preguntas sobre el sistema de notas chileno",
    questions: [
      {
        q: "¿Qué escala de notas usa la herramienta?",
        a: (
          <>
            Utiliza la escala chilena oficial 1.0–7.0 con 4.0 como nota mínima de aprobación.
            Esta es la escala estándar en universidades e institutos de Chile.
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
              <p className="text-sm font-medium text-blue-800">📊 Escala completa:</p>
              <div className="text-sm text-blue-700 mt-1 grid grid-cols-2 gap-1">
                <div><strong>1.0 - 3.9:</strong> Reprobado ❌</div>
                <div><strong>4.0 - 4.9:</strong> Suficiente ⚠️</div>
                <div><strong>5.0 - 5.9:</strong> Bueno ✅</div>
                <div><strong>6.0 - 6.9:</strong> Muy bueno 🌟</div>
                <div><strong>7.0:</strong> Excelente 🏆</div>
              </div>
            </div>
          </>
        )
      },
      {
        q: "¿Se guardan mis datos? ¿Es seguro usar la herramienta?",
        a: (
          <>
            Todos tus datos se guardan <strong>localmente en tu navegador</strong> usando localStorage.
            No se envían a ningún servidor externo, garantizando tu privacidad total.
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
              <p className="text-sm font-medium text-blue-800">🔒 Privacidad garantizada:</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• <strong>Datos locales:</strong> Solo en tu dispositivo</li>
                <li>• <strong>Sin registro:</strong> No necesitas crear cuenta</li>
                <li>• <strong>Backup opcional:</strong> Puedes exportar/importar datos</li>
                <li>• <strong>Sin cookies de tracking:</strong> Respetamos tu privacidad</li>
              </ul>
            </div>
          </>
        )
      },
      {
        q: "¿Puedo usar esto en mi teléfono?",
        a: (
          <>
            ¡Absolutamente! La herramienta está completamente optimizada para móviles.
            Funciona perfectamente en cualquier dispositivo con navegador web.
            <div className="mt-3 p-3 bg-purple-50 rounded border-l-4 border-purple-200">
              <p className="text-sm font-medium text-purple-800">📱 Características móviles:</p>
              <ul className="text-sm text-purple-700 mt-1 space-y-1">
                <li>• <strong>Diseño responsive:</strong> Se adapta a cualquier pantalla</li>
                <li>• <strong>Teclados inteligentes:</strong> Numérico para números</li>
                <li>• <strong>Botones grandes:</strong> Fácil navegación táctil</li>
                <li>• <strong>Offline:</strong> Funciona sin internet una vez cargado</li>
              </ul>
            </div>
          </>
        )
      },
      {
        q: "¿Qué navegadores son compatibles?",
        a: (
          <>
            La herramienta funciona en todos los navegadores modernos. Recomendamos mantener 
            tu navegador actualizado para la mejor experiencia.
            <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-gray-400">
              <p className="text-sm font-medium text-gray-800">🌐 Compatibilidad:</p>
              <ul className="text-sm text-gray-700 mt-1 space-y-1">
                <li>• <strong>Chrome/Chromium:</strong> Versión 90+ ✅</li>
                <li>• <strong>Firefox:</strong> Versión 88+ ✅</li>
                <li>• <strong>Safari:</strong> Versión 14+ ✅</li>
                <li>• <strong>Edge:</strong> Versión 90+ ✅</li>
              </ul>
            </div>
          </>
        )
      }
    ]
  },
  {
    id: "tips",
    title: "🎯 Tips y Trucos",
    icon: "🎯",
    description: "Consejos para aprovechar al máximo las herramientas",
    questions: [
      {
        q: "¿Cuáles son los atajos más útiles que debo conocer?",
        a: (
          <>
            Aquí tienes los trucos que te ahorrarán tiempo y harán más eficiente tu uso de las herramientas.
            <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">⚡ Atajos de productividad:</p>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• <strong>Ejemplos rápidos:</strong> Usa los botones preset para casos típicos</li>

                <li>• <strong>Presets de configuración:</strong> 60%, 70% en exigencia; 4.0, 5.5, 6.0 en umbrales</li>
                <li>• <strong>Cambio rápido de curso:</strong> Dropdown siempre visible</li>
              </ul>
            </div>
          </>
        )
      },
      {
        q: "¿Cómo puedo planificar mi estrategia de estudio con estas herramientas?",
        a: (
          <>
            Las herramientas te permiten hacer análisis &quot;qué pasaría si&quot; para optimizar tu rendimiento académico.
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
              <p className="text-sm font-medium text-blue-800">📈 Estrategias de planificación:</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• <strong>Escenarios optimistas:</strong> ¿Qué pasa si saco 7.0 en todo lo que queda?</li>
                <li>• <strong>Escenarios realistas:</strong> ¿Qué necesito para aprobar/eximirme?</li>
                <li>• <strong>Priorización:</strong> ¿En qué evaluación me conviene enfocar más?</li>
                <li>• <strong>Plan B:</strong> ¿Qué pasa si me va mal en una evaluación?</li>
              </ul>
            </div>
          </>
        )
      },
      {
        q: "¿Qué hacer si mis cálculos no coinciden con los del profesor?",
        a: (
          <>
            Si hay diferencias, generalmente se debe a distintos métodos de redondeo o configuración.
            <div className="mt-3 p-3 bg-orange-50 rounded border-l-4 border-orange-200">
              <p className="text-sm font-medium text-orange-800">🔍 Pasos para verificar:</p>
              <ol className="text-sm text-orange-700 mt-1 space-y-1 list-decimal list-inside">
                <li><strong>Exigencia:</strong> Confirma si usa 60%, 70% u otro valor</li>
                <li><strong>Redondeo:</strong> Algunos profesores redondean diferente</li>
                <li><strong>Porcentajes:</strong> Verifica que sumen exactamente 100%</li>
                <li><strong>Fórmula:</strong> Consulta si usa la fórmula chilena estándar</li>
              </ol>
            </div>
            Siempre consulta con tu profesor en caso de dudas importantes.
          </>
        )
      }
    ]
  }
];

export default function FAQPage() {
  // Preparar datos estructurados para FAQPage
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Preguntas Frecuentes - Calculadora de Notas Chile",
    "description": "Respuestas a preguntas frecuentes sobre el cálculo de promedios ponderados, nota mínima para aprobar y conversión de puntajes en el sistema educativo chileno",
    "inLanguage": "es-CL",
    "mainEntity": faqCategories.flatMap(category => 
      category.questions.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": typeof faq.a === 'string' ? faq.a : faq.q // Simplified for structured data
        }
      }))
    )
  };

  return (
    <>
      <main>
      {/* Header */}
      <section className="container py-12 sm:py-16">
        <div className="mb-3">
          <span className="kicker">Centro de ayuda</span>
        </div>
        <h1 className="text-3xl/[1.15] sm:text-4xl/[1.1] font-semibold tracking-tight">
          Preguntas Frecuentes
        </h1>
        <p className="mt-3 max-w-[70ch] text-base" style={{ color: "var(--color-text-muted)" }}>
          Todo lo que necesitas saber sobre el cálculo de promedios, conversión de puntajes 
          y el sistema de notas chileno. Encuentra respuestas rápidas y ejemplos prácticos.
        </p>
      </section>

      {/* Quick navigation */}
      <section className="container pb-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">🗂️ Navegar por categorías</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {faqCategories.map((category) => (
              <a 
                key={category.id}
                href={`#${category.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <div className="font-medium text-sm">{category.title.replace(/^.{2}\s/, '')}</div>
                  <div className="text-xs text-gray-600">{category.questions.length} preguntas</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      {faqCategories.map((category, categoryIndex) => (
        <section key={category.id} id={category.id} className="container pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <span className="text-3xl">{category.icon}</span>
              {category.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{category.description}</p>
          </div>
          
          <div className="grid gap-4">
            {category.questions.map((faq, questionIndex) => (
              <div key={questionIndex} className="card">
                <details className="group">
                  <summary className="p-6 cursor-pointer select-none flex items-center justify-between">
                    <h3 className="text-base font-semibold pr-4">{faq.q}</h3>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">
                      ⌄
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {faq.a}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Quick tools access */}
      <section className="container pb-12">
        <div className="card p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">🚀 ¿Listo para empezar?</h2>
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
              Accede directamente a las herramientas que necesitas
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/promedio" className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-medium">Calculadora de Promedio</div>
                  <div className="text-xs text-gray-600">Promedio ponderado y nota mínima</div>
                </div>
              </div>
            </Link>
            
            <Link href="/puntaje-a-nota" className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧮</span>
                <div>
                  <div className="font-medium">Puntaje → Nota</div>
                  <div className="text-xs text-gray-600">Convierte puntos a nota 1.0-7.0</div>
                </div>
              </div>
            </Link>
            
            <div className="card p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="font-medium">Centro de Ayuda</div>
                  <div className="text-xs text-gray-600">Estás aquí • FAQ y tutoriales</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/promedio" className="btn btn-primary mr-3">
              Abrir Calculadora
            </Link>
            <Link href="/puntaje-a-nota" className="btn btn-ghost">
              Convertir Puntaje
            </Link>
          </div>
        </div>
      </section>

      {/* Contact support */}
      <section className="container pb-16">
        <div className="card p-6 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-start gap-4">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="font-semibold text-blue-900">¿No encontraste lo que buscabas?</h3>
              <p className="text-sm text-blue-800 mt-1">
                Si tienes una pregunta específica que no está cubierta aquí, o encontraste un error 
                en los cálculos, no dudes en contactarnos. Estamos aquí para ayudarte.
              </p>
              <div className="mt-3 text-sm">
                <span className="text-blue-700">
                  ✉️ Sugerencias y reportes: Usa el formulario de contacto o reporta issues en nuestro repositorio.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* Structured Data para FAQPage */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqStructuredData)
      }}
    />
    </>
  );
}
