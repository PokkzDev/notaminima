export const metadata = {
  title: "📊 Calculadora de Promedio Ponderado Chile | Nota Mínima para Aprobar 1.0-7.0",
  description:
    "🎯 Calcula tu promedio ponderado automáticamente. Ingresa evaluaciones con porcentaje y descubre cuánto necesitas para aprobar (4.0) o eximirte. Gestiona múltiples cursos. ¡Gratis!",
  keywords: "calculadora promedio ponderado, nota minima aprobar chile, promedio evaluaciones porcentaje, escala 1.0 7.0, eximirse examen, gestionar cursos universitarios",
  alternates: { canonical: "/promedio" },
  openGraph: {
    title: "📊 Calculadora de Promedio Ponderado Chile | Nota Mínima Aprobar",
    description:
      "Calcula automáticamente tu promedio ponderado y descubre cuánto necesitas para aprobar o eximirte. Compatible con el sistema educativo chileno.",
    type: "website",
    locale: "es_CL",
    url: "https://notaminima.cl/promedio",
    siteName: "Nota Mínima",
    images: [
      {
        url: "https://notaminima.cl/logo-256.png",
        width: 256,
        height: 256,
        alt: "Calculadora de Promedio Ponderado Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "📊 Calculadora de Promedio Ponderado Chile | Nota Mínima Aprobar",
    description:
      "Calcula promedio ponderado automáticamente y encuentra la nota mínima para aprobar con escala chilena 1.0-7.0.",
    images: ["https://notaminima.cl/logo-256.png"],
  },
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
};

import ClientAverageCalculatorPage from "./ClientPage";

export default function AverageCalculatorPage() {
  return <ClientAverageCalculatorPage />;
}


