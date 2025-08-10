export const metadata = {
  title: "Calcular Promedio Ponderado | Escala 1.0–7.0 Chile",
  description:
    "Ingresa evaluaciones con peso, nota o puntos. Calcula el promedio, estado y la nota mínima necesaria para aprobar/eximir.",
  alternates: { canonical: "/promedio" },
  openGraph: {
    title: "Calcular Promedio Ponderado | Escala 1.0–7.0 Chile",
    description:
      "Ingresa evaluaciones con peso, nota o puntos. Calcula el promedio y la nota mínima necesaria para aprobar/eximir.",
    type: "website",
    locale: "es_CL",
    url: "https://notaminima.cl/promedio",
    siteName: "Nota Mínima",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calcular Promedio Ponderado | Escala 1.0–7.0 Chile",
    description:
      "Promedio, estado y nota mínima para aprobar/eximir con escala chilena.",
  },
};

import ClientAverageCalculatorPage from "./ClientPage";

export default function AverageCalculatorPage() {
  return <ClientAverageCalculatorPage />;
}


