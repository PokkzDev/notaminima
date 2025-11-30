export const metadata = {
  title: "Crear Cuenta | NotaMinima",
  description: "Regístrate gratis en NotaMinima para guardar tus promedios de notas en la nube y acceder desde cualquier dispositivo. Calculadora de notas para estudiantes chilenos.",
  keywords: [
    "registrarse notaminima",
    "crear cuenta calculadora notas",
    "registro estudiante chile",
    "nueva cuenta notaminima",
    "registrar cuenta gratis",
  ],
  openGraph: {
    title: "Crear Cuenta | NotaMinima",
    description: "Regístrate gratis en NotaMinima para guardar tus promedios de notas en la nube y acceder desde cualquier dispositivo.",
    url: "https://notaminima.cl/register",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Crear Cuenta",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Crear Cuenta | NotaMinima",
    description: "Regístrate gratis en NotaMinima para guardar tus promedios de notas en la nube.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/register",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterLayout({ children }) {
  return children;
}
