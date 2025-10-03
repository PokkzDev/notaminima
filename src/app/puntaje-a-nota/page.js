export const metadata = {
  title: "Conversor de Puntaje a Nota Chile | X/Y Puntos → Escala 1.0-7.0 | Exigencia 60%-70%",
  description:
    "Convierte fácilmente cualquier puntaje (30/60, 45/90, 70/100 puntos) a nota chilena 1.0-7.0. Selecciona entre exigencia 60% o 70% según tu institución.",
  keywords: "convertir puntaje nota chile, X Y puntos nota 1.0 7.0, exigencia 60% 70%, calculadora puntaje nota, conversion puntaje nota chilena",
  alternates: { canonical: "/puntaje-a-nota" },
  openGraph: {
    title: "Conversor Puntaje → Nota Chile | Escala 1.0-7.0",
    description:
      "Conversor simple e intuitivo para convertir puntajes a notas chilenas. Selecciona el total de puntos y la exigencia para obtener tu nota instantáneamente.",
    type: "website",
    locale: "es_CL",
    url: "https://notaminima.cl/puntaje-a-nota",
    siteName: "Nota Mínima",
    images: [
      {
        url: "https://notaminima.cl/logo-256.png",
        width: 256,
        height: 256,
        alt: "Conversor de Puntaje a Nota Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversor Puntaje → Nota Chile | Escala 1.0-7.0",
    description:
      "Convierte fácilmente puntajes a notas chilenas con esta herramienta simple e intuitiva.",
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

import ClientPointsToGradePage from "./ClientPage";

export default function PointsToGradePage() {
  return <ClientPointsToGradePage />;
}

