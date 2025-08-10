import "./globals.css";
import Link from "next/link";

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
              <Link href="/promedio" className="text-sm font-medium">Promedio</Link>
              <Link href="/puntaje-a-nota" className="text-sm font-medium">Puntaje→Nota</Link>
              <Link href="/faq" className="text-sm font-medium">FAQ</Link>
              <Link href="/promedio" className="btn btn-primary">Empezar</Link>
            </div>
          </nav>
        </header>

        {children}

        <footer style={{ borderTop: "1px solid var(--color-border)" }} className="mt-12">
          <div className="container py-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>© {currentYear} Nota Mínima. Chile (CL).</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
              <Link href="/acerca">Acerca</Link>
              <a
                href="https://pokkz.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                Desarrollado por pokkz.dev
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
