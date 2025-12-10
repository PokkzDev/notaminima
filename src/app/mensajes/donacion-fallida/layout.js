export const metadata = {
  title: "Pago no completado | NotaMinima",
  description: "El pago no se completó, pero no te preocupes. NotaMinima seguirá siendo gratuito para ti siempre.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Pago no completado | NotaMinima",
    description: "El pago no se completó, pero no te preocupes. NotaMinima seguirá siendo gratuito para ti siempre.",
    url: "https://notaminima.cl/mensajes/donacion-fallida",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
};

export default function DonacionFallidaLayout({ children }) {
  return children;
}


