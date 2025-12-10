export const metadata = {
  title: "Acerca de NotaMinima | Calculadora de Notas Chile",
  description: "NotaMinima: la plataforma gratuita más completa para estudiantes chilenos. Calcula promedios, convierte puntajes, sincroniza en la nube, desbloquea logros y visualiza tu progreso académico.",
  keywords: [
    "acerca de notaminima",
    "sobre notaminima",
    "calculadora notas chile",
    "sistema evaluación chileno",
    "escala notas 1.0 7.0",
    "herramienta educativa chile",
    "plataforma académica gratuita",
    "dashboard estudiantes",
    "logros académicos",
    "sincronización notas nube",
  ],
  openGraph: {
    title: "Acerca de NotaMinima | La Calculadora de Notas más Completa de Chile",
    description: "Plataforma gratuita para estudiantes chilenos: calcula promedios, convierte puntajes, sincroniza en la nube y desbloquea logros.",
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
    description: "La plataforma gratuita más completa para gestionar tu rendimiento académico en Chile.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/acerca",
  },
};

export default function AcercaLayout({ children }) {
  return children;
}
