export const metadata = {
  title: "Iniciar Sesión | NotaMinima",
  description: "Accede a tu cuenta de NotaMinima para gestionar tus promedios de notas y sincronizar tus datos académicos entre dispositivos.",
  keywords: [
    "iniciar sesión notaminima",
    "login calculadora notas",
    "acceder cuenta estudiante",
    "inicio sesión chile",
    "cuenta notaminima",
  ],
  openGraph: {
    title: "Iniciar Sesión | NotaMinima",
    description: "Accede a tu cuenta de NotaMinima para gestionar tus promedios de notas y sincronizar tus datos académicos entre dispositivos.",
    url: "https://notaminima.cl/login",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Iniciar Sesión",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Iniciar Sesión | NotaMinima",
    description: "Accede a tu cuenta de NotaMinima para gestionar tus promedios de notas.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/login",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({ children }) {
  return children;
}
