export const metadata = {
  title: "Acerca de NotaMinima | Calculadora de Notas Chile",
  description: "Conoce NotaMinima, la calculadora gratuita de notas para estudiantes chilenos. Aprende sobre el sistema de evaluación chileno y cómo funcionan nuestras herramientas educativas.",
  keywords: [
    "acerca de notaminima",
    "sobre notaminima",
    "calculadora notas chile",
    "sistema evaluación chileno",
    "escala notas 1.0 7.0",
    "herramienta educativa chile",
    "información notaminima",
  ],
  openGraph: {
    title: "Acerca de NotaMinima | Calculadora de Notas Chile",
    description: "Conoce NotaMinima, la calculadora gratuita de notas para estudiantes chilenos. Aprende sobre el sistema de evaluación chileno.",
    url: "https://notaminima.cl/acerca",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Acerca de Nosotros",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Acerca de NotaMinima | Calculadora de Notas Chile",
    description: "Conoce NotaMinima, la calculadora gratuita de notas para estudiantes chilenos.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/acerca",
  },
};

export default function AcercaLayout({ children }) {
  return children;
}
