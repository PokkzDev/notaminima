export const metadata = {
  title: "Escala de Notas Chile | NotaMinima",
  description: "Genera una tabla completa de conversión de puntajes a notas según el sistema educativo chileno. Personaliza el puntaje máximo, exigencia y paso de incremento.",
  keywords: [
    "escala de notas chile",
    "tabla de conversión puntaje nota",
    "escala 1.0 a 7.0",
    "tabla de notas chile",
    "conversión puntaje nota",
    "calculadora escala notas",
    "sistema de notas chileno",
    "tabla de puntajes a notas",
  ],
  openGraph: {
    title: "Escala de Notas Chile | NotaMinima",
    description: "Genera una tabla completa de conversión de puntajes a notas según el sistema educativo chileno. Personaliza el puntaje máximo, exigencia y paso de incremento.",
    url: "https://notaminima.cl/escala-de-notas",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Escala de Notas",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Escala de Notas Chile | NotaMinima",
    description: "Genera una tabla completa de conversión de puntajes a notas según el sistema educativo chileno.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/escala-de-notas",
  },
};

export default function EscalaDeNotasLayout({ children }) {
  return children;
}




