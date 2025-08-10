export const metadata = {
  title: "Política de Privacidad | Nota Mínima",
  description:
    "Cómo tratamos tus datos: almacenamiento local en tu navegador, sin cuentas ni rastreadores. Transparencia y control para ti.",
  alternates: { canonical: "/privacidad" },
  openGraph: {
    title: "Política de Privacidad | Nota Mínima",
    description:
      "La app guarda tus cursos localmente en tu navegador. No usamos cuentas ni rastreadores.",
    type: "article",
    locale: "es_CL",
    url: "https://notaminima.cl/privacidad",
    siteName: "Nota Mínima",
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidad | Nota Mínima",
    description:
      "Tus datos se mantienen en tu navegador. Sin cuentas ni publicidad personalizada.",
  },
};

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main>
      {/* Header */}
      <section className="container py-10 sm:py-14">
        <h1 className="text-3xl/[1.1] sm:text-4xl/[1.05] font-semibold tracking-tight">
          Política de Privacidad
        </h1>
        <p className="mt-3 max-w-[70ch] text-sm" style={{ color: "var(--color-text-muted)" }}>
          En Nota Mínima nos tomamos en serio tu privacidad. Esta página explica qué
          datos se tratan, con qué propósito y dónde se almacenan.
        </p>
      </section>

      {/* Content */}
      <section className="container pb-10 sm:pb-14">
        <div className="grid gap-4">
          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Alcance</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              La presente política aplica al sitio y herramientas disponibles en
              <strong> notaminima.cl</strong>.
            </p>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Datos que procesa tu navegador</h2>
            <ul className="mt-2 grid gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              <li>
                • Guardamos localmente en tu navegador (LocalStorage) tus cursos,
                evaluaciones y preferencias para que no los pierdas al recargar.
              </li>
              <li>
                • No se envían estos datos a un servidor ni se asocian a cuentas de usuario.
              </li>
              <li>
                • Puedes exportar o importar un respaldo desde la sección
                {" "}
                <Link href="/promedio" className="underline">Promedio</Link>.
              </li>
            </ul>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Cookies y analítica</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              No utilizamos cookies de seguimiento ni publicidad personalizada.
              En caso de incorporar analítica básica y anónima en el futuro, esta
              página será actualizada indicando proveedor y propósito.
            </p>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Seguridad</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Tus datos permanecen en tu dispositivo. Te recomendamos mantener tu
              navegador actualizado y proteger el acceso físico a tus equipos.
            </p>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Menores de edad</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              La herramienta puede ser utilizada por estudiantes. No recogemos
              información personal identificable.
            </p>
          </article>

          <article className="card p-6 sm:p-7">
            <h2 className="text-base font-semibold">Cambios y contacto</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Podemos actualizar este documento para reflejar mejoras o cambios
              regulatorios. La fecha de última actualización se mostrará aquí.
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              ¿Dudas? Escríbenos en <a href="https://pokkz.dev" target="_blank" rel="noopener noreferrer" className="underline">pokkz.dev</a>.
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


