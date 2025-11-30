export const metadata = {
  title: "Ayuda y Preguntas Frecuentes | NotaMinima",
  description: "Guía completa para usar NotaMinima. Aprende a calcular promedios ponderados, convertir puntajes a notas y gestionar tus cursos en el sistema educativo chileno.",
  keywords: [
    "ayuda notaminima",
    "preguntas frecuentes notas",
    "cómo calcular promedio ponderado",
    "tutorial calculadora notas",
    "guía puntaje a nota",
    "faq notaminima",
    "ayuda estudiantes chile",
  ],
  openGraph: {
    title: "Ayuda y Preguntas Frecuentes | NotaMinima",
    description: "Guía completa para usar NotaMinima. Aprende a calcular promedios ponderados, convertir puntajes a notas y gestionar tus cursos.",
    url: "https://notaminima.cl/ayuda",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Ayuda",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ayuda y Preguntas Frecuentes | NotaMinima",
    description: "Guía completa para usar NotaMinima. Aprende a calcular promedios ponderados y convertir puntajes a notas.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/ayuda",
  },
};

export default function AyudaLayout({ children }) {
  return children;
}
