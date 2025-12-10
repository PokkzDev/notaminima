export const metadata = {
  title: "¡Gracias por tu donación! | NotaMinima",
  description: "Tu donación ha sido procesada exitosamente. Gracias por apoyar a NotaMinima y ayudarnos a seguir siendo gratuitos para todos los estudiantes chilenos.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "¡Gracias por tu donación! | NotaMinima",
    description: "Tu donación ha sido procesada exitosamente. Gracias por apoyar a NotaMinima.",
    url: "https://notaminima.cl/mensajes/donacion-completada",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Donación Completada",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
};

export default function DonacionCompletadaLayout({ children }) {
  return children;
}



