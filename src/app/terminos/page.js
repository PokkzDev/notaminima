export const metadata = {
  title: "Términos y Condiciones | Nota Mínima",
  description:
    "Condiciones de uso de las herramientas de cálculo. Información educativa, sin garantías y sujeta a mejora continua.",
  alternates: { canonical: "/terminos" },
  openGraph: {
    title: "Términos y Condiciones | Nota Mínima",
    description:
      "Uso personal y educativo. Verifica resultados importantes con tus docentes.",
    type: "article",
    locale: "es_CL",
    url: "https://notaminima.cl/terminos",
    siteName: "Nota Mínima",
  },
  twitter: {
    card: "summary",
    title: "Términos y Condiciones | Nota Mínima",
    description:
      "Herramientas sin garantía; úsala como apoyo académico."
  },
};

import Link from "next/link";

export default function TermsPage() {
  return (
    <main>
      {/* Header */}
      <section className="container py-10 sm:py-14">
        <h1 className="text-3xl/[1.1] sm:text-4xl/[1.05] font-semibold tracking-tight">
          Términos y Condiciones
        </h1>
        <p className="mt-3 max-w-[70ch] text-sm" style={{ color: "var(--color-text-muted)" }}>
          Al usar Nota Mínima aceptas estas condiciones. Lee con atención.
        </p>
      </section>

      {/* Content */}
      <section className="container pb-10 sm:pb-14">
        <div className="grid gap-4">
          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Naturaleza del servicio</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Nota Mínima ofrece calculadoras académicas con fines informativos y
              educativos. Los resultados son aproximados según la información que
              ingresas. Verifica siempre con tu programa y docentes.
            </p>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Responsabilidad</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              El uso es bajo tu propio riesgo. No ofrecemos garantías de
              precisión, disponibilidad ni adecuación para un propósito
              particular. No nos hacemos responsables por decisiones tomadas
              exclusivamente en base a los resultados de la app.
            </p>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Uso permitido</h2>
            <ul className="mt-2 grid gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              <li>• Uso personal y no comercial.</li>
              <li>• No intentar descompilar, atacar o interrumpir el servicio.</li>
              <li>• No suplantar identidad ni cargar contenido malicioso.</li>
            </ul>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Propiedad intelectual</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Marca, diseño y código pertenecen a sus respectivos titulares.
              Puedes enlazar a la app y citarla con atribución.
            </p>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Privacidad</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Consulta la <Link href="/privacidad" className="underline">Política de Privacidad</Link> para conocer el tratamiento de datos.
            </p>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Modificaciones</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Podemos actualizar estos términos en cualquier momento. Los cambios
              serán efectivos al publicarse aquí. Si continúas usando la app tras
              una actualización, se entiende que aceptas los nuevos términos.
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Última actualización: {new Date().toISOString().slice(0, 10)}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}


