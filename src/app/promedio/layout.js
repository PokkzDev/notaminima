export const metadata = {
  title: "Calculadora de Promedio Ponderado | NotaMinima",
  description: "Calcula tu promedio de notas ponderado fácilmente. Gestiona múltiples cursos, agrega notas con ponderaciones y calcula automáticamente tu promedio académico.",
  keywords: [
    "calculadora de promedio",
    "promedio ponderado chile",
    "calculadora de notas",
    "promedio académico",
    "gestión de cursos",
    "notas universitarias chile",
    "calculadora promedio ponderado",
    "promedio de notas chile",
  ],
  openGraph: {
    title: "Calculadora de Promedio Ponderado | NotaMinima",
    description: "Calcula tu promedio de notas ponderado fácilmente. Gestiona múltiples cursos, agrega notas con ponderaciones y calcula automáticamente tu promedio académico.",
    url: "https://notaminima.cl/promedio",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Calculadora de Promedio",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Calculadora de Promedio Ponderado | NotaMinima",
    description: "Calcula tu promedio de notas ponderado fácilmente. Gestiona múltiples cursos y calcula automáticamente tu promedio académico.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/promedio",
  },
};

export default function PromedioLayout({ children }) {
  return children;
}

