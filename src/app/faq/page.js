export const metadata = {
  title: "Preguntas Frecuentes (FAQ) | Nota Mínima",
  description:
    "Resuelve dudas sobre promedio, nota mínima para aprobar, exigencia 60%/70% y cómo convertir puntaje a nota en escala 1.0–7.0.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Preguntas Frecuentes (FAQ) | Nota Mínima",
    description:
      "Resuelve dudas sobre promedio, nota mínima, exigencia y conversión de puntaje a nota.",
    type: "article",
    locale: "es_CL",
    url: "https://notaminima.cl/faq",
    siteName: "Nota Mínima",
  },
  twitter: {
    card: "summary",
    title: "Preguntas Frecuentes (FAQ) | Nota Mínima",
    description:
      "Resuelve dudas sobre promedio, nota mínima, exigencia y conversión de puntaje a nota.",
  },
};

import Link from "next/link";

export default function FAQPage() {
  return (
    <main>
      {/* Header */}
      <section className="container py-10 sm:py-14">
        <h1 className="text-3xl/[1.1] sm:text-4xl/[1.05] font-semibold tracking-tight">
          Preguntas Frecuentes
        </h1>
        <p className="mt-3 max-w-[70ch] text-sm" style={{ color: "var(--color-text-muted)" }}>
          Respuestas breves a dudas comunes sobre promedios, nota mínima para aprobar y
          conversión de puntaje a nota en la escala chilena 1.0–7.0.
        </p>
      </section>

      {/* FAQ list */}
      <section className="container pb-10 sm:pb-14">
        <div className="card p-6 sm:p-7">
          <div className="grid gap-4">
            <details>
              <summary className="text-base font-semibold cursor-pointer select-none">
                ¿Cómo calculo mi promedio con evaluaciones que tienen porcentaje distinto?
              </summary>
              <div className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                Para un promedio ponderado, multiplica la nota de cada evaluación por su
                porcentaje relativo, suma los resultados y divide por la suma de los porcentajes
                considerados. Puedes hacerlo automáticamente con la calculadora de
                <Link href="/promedio" className="underline ml-1">promedios</Link>.
              </div>
            </details>

            <details>
              <summary className="text-base font-semibold cursor-pointer select-none">
                ¿Qué es la “exigencia” 60%/70% y cómo afecta la nota?
              </summary>
              <div className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                La exigencia define qué porcentaje del puntaje máximo equivale a la nota
                mínima aprobatoria (generalmente 4.0). Con 60% de exigencia, obtener el 60%
                del puntaje total corresponde a 4.0. Con 70%, se requiere el 70% para 4.0.
                Usa el conversor de <Link href="/puntaje-a-nota" className="underline">puntaje → nota</Link> para simularlo.
              </div>
            </details>

            <details>
              <summary className="text-base font-semibold cursor-pointer select-none">
                ¿Cómo encuentro la nota mínima que necesito en lo que falta del curso?
              </summary>
              <div className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                Ingresa tus evaluaciones ya rendidas y las que faltan con su porcentaje en la
                sección <Link href="/promedio" className="underline">promedio</Link>.
                La herramienta te mostrará cuánto necesitas para alcanzar la aprobación en
                el porcentaje restante.
              </div>
            </details>

            <details>
              <summary className="text-base font-semibold cursor-pointer select-none">
                ¿Puedo convertir X/Y puntos a una nota 1.0–7.0 rápidamente?
              </summary>
              <div className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                Sí. Abre el conversor de <Link href="/puntaje-a-nota" className="underline">puntaje → nota</Link>,
                ingresa los puntos obtenidos, el máximo posible y la exigencia (60% o 70%).
                Verás la nota equivalente y etiquetas de referencia.
              </div>
            </details>

            <details>
              <summary className="text-base font-semibold cursor-pointer select-none">
                ¿Qué escala usa la herramienta?
              </summary>
              <div className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                Utiliza la escala chilena 1.0–7.0 con 4.0 como nota mínima de aprobación.
                Puedes ajustar exigencia y puntaje máximo según la evaluación.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12 sm:pb-16">
        <div className="card p-6 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Listo para calcular</h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Empieza en segundos: promedio, nota mínima y conversión de puntaje a nota.
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


