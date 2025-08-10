import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Nota Mínima",
  description: "Calcula tu nota mínima en escala chilena 1.0–7.0",
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="es-CL">
      <body>
        <header style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "saturate(180%) blur(10px)",
          WebkitBackdropFilter: "saturate(180%) blur(10px)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          zIndex: 50
        }}>
          <nav className="container py-3 flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-base">
              <span>Nota Mínima</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium">Inicio</Link>
              <span aria-hidden="true" role="separator" className="text-sm text-[var(--color-text-muted)]">|</span>
              <Link href="/promedio" className="text-sm font-medium">Promedio</Link>
              <Link href="/puntaje-a-nota" className="text-sm font-medium">Puntaje→Nota</Link>
              <span aria-hidden="true" role="separator" className="text-sm text-[var(--color-text-muted)]">|</span>
              <Link href="/faq" className="text-sm font-medium">Preguntas frecuentes</Link>
            </div>
          </nav>
        </header>

        {children}

        <footer
          style={{
            borderTop: "1px solid var(--color-border)",
            background:
              "linear-gradient(180deg, rgba(241,245,249,0.35), rgba(248,250,252,0))",
          }}
          className="mt-16"
        >
          <div className="container py-10">
            <div className="grid gap-8 sm:grid-cols-3 sm:items-start">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-256.png"
                  alt="Logo Nota Mínima"
                  width={28}
                  height={28}
                  className="rounded-md border border-[var(--color-border)]"
                />
                <div>
                  <p className="text-base font-semibold">Nota Mínima</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Herramientas para estudiantes en Chile
                  </p>
                </div>
              </div>

              <nav aria-label="Enlaces de pie de página" className="sm:justify-self-center">
                <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
                  <li><Link href="/">Inicio</Link></li>
                  <li><Link href="/promedio">Promedio</Link></li>
                  <li><Link href="/puntaje-a-nota">Puntaje→Nota</Link></li>
                  <li><Link href="/faq">Preguntas frecuentes</Link></li>
                  <li><Link href="/privacidad">Privacidad</Link></li>
                  <li><Link href="/terminos">Términos</Link></li>
                </ul>
              </nav>

              <div className="sm:justify-self-end text-sm">
                <p style={{ color: "var(--color-text-muted)" }}>© {currentYear} Nota Mínima · Chile</p>
                <p className="mt-2">
                  Desarrollado por {" "}
                  <a
                    href="https://pokkz.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 decoration-[var(--color-border)] hover:decoration-current"
                  >
                    pokkz.dev
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
