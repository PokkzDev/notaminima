export const metadata = {
  title: "Centro de Ayuda | NotaMinima",
  description: "Guía completa de NotaMinima: calcula promedios ponderados, convierte puntajes a notas, sincroniza entre dispositivos y desbloquea logros. Preguntas frecuentes sobre el sistema de notas chileno.",
  keywords: [
    "ayuda notaminima",
    "preguntas frecuentes notas",
    "cómo calcular promedio ponderado",
    "tutorial calculadora notas",
    "guía puntaje a nota",
    "faq notaminima",
    "ayuda estudiantes chile",
    "sincronizar notas dispositivos",
    "dashboard académico",
    "logros académicos",
  ],
  openGraph: {
    title: "Centro de Ayuda | NotaMinima",
    description: "Guía completa de NotaMinima: calcula promedios, convierte puntajes, sincroniza datos y desbloquea logros académicos.",
    url: "https://notaminima.cl/ayuda",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Centro de Ayuda",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Centro de Ayuda | NotaMinima",
    description: "Guía completa de NotaMinima: calcula promedios, convierte puntajes y gestiona tu rendimiento académico.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/ayuda",
  },
};

export default function AyudaLayout({ children }) {
  return children;
}
