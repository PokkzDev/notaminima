export const metadata = {
  title: "Puntaje a Nota (60/90/100 puntos) | Exigencia 60%",
  description:
    "Convierte X/Y puntos a nota chilena 1.0–7.0. Ajusta exigencia y total de preguntas.",
  alternates: { canonical: "/puntaje-a-nota" },
  openGraph: {
    title: "Puntaje a Nota (60/90/100 puntos) | Exigencia 60%",
    description:
      "Convierte X/Y puntos a nota chilena 1.0–7.0. Ajusta exigencia y total de preguntas.",
    type: "website",
    locale: "es_CL",
    url: "https://notaminima.cl/puntaje-a-nota",
    siteName: "Nota Mínima",
  },
  twitter: {
    card: "summary_large_image",
    title: "Puntaje a Nota (60/90/100 puntos) | Exigencia 60%",
    description:
      "Convierte X/Y puntos a nota chilena 1.0–7.0. Ajusta exigencia y total de preguntas.",
  },
};

import ClientPointsToGradePage from "./ClientPage";

export default function PointsToGradePage() {
  return <ClientPointsToGradePage />;
}

