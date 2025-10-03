import "./globals.css";
import Navbar from "./components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Nota Mínima",
  description: "Calcula tu nota mínima en escala chilena 1.0–7.0",
  keywords: "calculadora notas, promedio ponderado, escala chilena, 1.0 a 7.0, nota mínima, Chile, estudiantes, universidad, instituto, educación",
  authors: [{ name: "Nota Mínima", url: "https://notaminima.cl" }],
  creator: "Nota Mínima",
  publisher: "Nota Mínima",
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
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code when available
  },
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="es-CL">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* PWA and mobile optimizations */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nota Mínima" />
        <link rel="apple-touch-icon" href="/logo-256.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Geographic targeting */}
        <meta name="geo.region" content="CL" />
        <meta name="geo.country" content="Chile" />
        <meta name="geo.placename" content="Chile" />
        <meta name="language" content="Spanish" />
        <meta name="distribution" content="global" />
        <meta name="target" content="all" />
        <meta name="audience" content="general" />
        <meta name="rating" content="general" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Nota Mínima",
              "alternateName": "Calculadora de Notas Chile",
              "url": "https://notaminima.cl",
              "description": "Calculadora de notas para el sistema educativo chileno. Calcula promedios ponderados, nota mínima para aprobar y convierte puntajes a notas en escala 1.0-7.0",
              "inLanguage": "es-CL",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://notaminima.cl/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Nota Mínima",
                "url": "https://notaminima.cl",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://notaminima.cl/logo-256.png",
                  "width": 256,
                  "height": 256
                }
              },
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student"
              },
              "mainEntity": {
                "@type": "WebApplication",
                "name": "Calculadora de Notas Chile",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "CLP"
                }
              }
            })
          }}
        />
        
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3504234733980898"
          crossOrigin="anonymous"
        ></script>
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YVMN8Q4ZNR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YVMN8Q4ZNR');
            `
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>
          {children}
        </main>

        <footer
          style={{
            borderTop: "1px solid var(--color-border)",
            background:
              "linear-gradient(180deg, rgba(241,245,249,0.35), rgba(248,250,252,0))",
          }}
          className="mt-16"
          role="contentinfo"
          aria-label="Información del sitio web"
        >
          <div className="container py-10">
            <div className="grid gap-8 sm:grid-cols-3 sm:items-start">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-256.png"
                  alt="Logo Nota Mínima - Calculadora de notas para estudiantes chilenos"
                  width={28}
                  height={28}
                  className="rounded-md border border-[var(--color-border)]"
                />
                <div>
                  <p className="text-base font-semibold">Nota Mínima</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Herramientas educativas gratuitas para estudiantes en Chile
                  </p>
                </div>
              </div>

              <nav aria-label="Enlaces de pie de página" className="sm:justify-self-center">
                <h3 className="sr-only">Enlaces del sitio</h3>
                <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  <li><Link href="/" aria-label="Ir al inicio" className="hover:text-blue-600 transition-colors">Inicio</Link></li>
                  <li><Link href="/promedio" aria-label="Calculadora de promedio" className="hover:text-blue-600 transition-colors font-medium">Promedio</Link></li>
                  <li><Link href="/puntaje-a-nota" aria-label="Conversor puntaje a nota" className="hover:text-blue-600 transition-colors">Puntaje→Nota</Link></li>
                  <li><Link href="/faq" aria-label="Preguntas frecuentes" className="hover:text-blue-600 transition-colors">Ayuda</Link></li>
                  <li><Link href="/privacidad" aria-label="Política de privacidad" className="hover:text-blue-600 transition-colors">Privacidad</Link></li>
                  <li><Link href="/terminos" aria-label="Términos y condiciones" className="hover:text-blue-600 transition-colors">Términos</Link></li>
                </ul>
              </nav>

              <div className="sm:justify-self-end text-sm">
                <p style={{ color: "var(--color-text-muted)" }}>
                  © {currentYear} Nota Mínima · Chile 🇨🇱
                </p>
                <p className="mt-2">
                  Desarrollado por{" "}
                  <a
                    href="https://pokkz.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Sitio web del desarrollador pokkz.dev"
                    className="underline underline-offset-4 decoration-[var(--color-border)] hover:decoration-current"
                  >
                    pokkz.dev
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Organization structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Nota Mínima",
                "url": "https://notaminima.cl",
                "logo": "https://notaminima.cl/logo-256.png",
                "description": "Herramientas educativas gratuitas para estudiantes en Chile. Calculadora de promedios ponderados y conversión de puntajes a notas en escala 1.0-7.0",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "CL"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "url": "https://notaminima.cl/faq"
                },
                "sameAs": [
                  "https://notaminima.cl"
                ]
              })
            }}
          />
        </footer>
      </body>
    </html>
  );
}
