export const metadata = {
  title: "Conversor Puntaje a Nota Chile | NotaMinima",
  description: "Convierte puntajes de evaluaciones a notas según el sistema chileno. Calcula tu nota en escala 1.0-7.0 con porcentaje de exigencia personalizable.",
  keywords: [
    "puntaje a nota chile",
    "conversor puntaje nota",
    "calculadora nota chile",
    "escala 1.0 a 7.0",
    "convertir puntaje a nota",
    "calculadora de nota chile",
    "sistema de notas chileno",
    "conversor de puntajes",
  ],
  openGraph: {
    title: "Conversor Puntaje a Nota Chile | NotaMinima",
    description: "Convierte puntajes de evaluaciones a notas según el sistema chileno. Calcula tu nota en escala 1.0-7.0 con porcentaje de exigencia personalizable.",
    url: "https://notaminima.cl/puntaje-a-nota",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Conversor Puntaje a Nota",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Conversor Puntaje a Nota Chile | NotaMinima",
    description: "Convierte puntajes de evaluaciones a notas según el sistema chileno. Calcula tu nota en escala 1.0-7.0.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/puntaje-a-nota",
  },
};

export default function PuntajeANotaLayout({ children }) {
  return children;
}

