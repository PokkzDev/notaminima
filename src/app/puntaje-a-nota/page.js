export const metadata = {
  title: "🧮 Convertir Puntaje a Nota Chile | X/Y Puntos → Escala 1.0-7.0 | Exigencia 60%-70%",
  description:
    "🎯 Convierte cualquier puntaje (30/60, 45/90, 70/100 puntos) a nota chilena 1.0-7.0 instantáneamente. Configura exigencia 60%, 70% según tu institución. Presets incluidos. ¡Gratis!",
  keywords: "convertir puntaje nota chile, X Y puntos nota 1.0 7.0, exigencia 60% 70%, calculadora puntaje nota, formula chilena conversion, prueba examen puntaje",
  alternates: { canonical: "/puntaje-a-nota" },
  openGraph: {
    title: "🧮 Conversor Puntaje → Nota Chile | Escala 1.0-7.0 con Exigencia",
    description:
      "Convierte instantáneamente cualquier puntaje a nota chilena. Configura exigencia (60%, 70%) y usa presets comunes. Fórmula oficial del sistema educativo chileno.",
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
    title: "🧮 Conversor Puntaje → Nota Chile | Escala 1.0-7.0 con Exigencia",
    description:
      "Convierte puntajes a notas chilenas instantáneamente. Exigencia configurable y presets incluidos.",
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

