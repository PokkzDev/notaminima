import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  metadataBase: new URL('https://notaminima.cl'),
  title: {
    default: "NotaMinima - Calculadora de Notas Chile | Promedio y Puntaje a Nota",
    template: "%s | NotaMinima"
  },
  description: "Calculadora gratuita de notas para estudiantes chilenos. Calcula tu promedio ponderado y convierte puntajes a notas en escala 1.0-7.0. Herramienta educativa sin registro.",
  keywords: [
    "calculadora de notas chile",
    "promedio ponderado",
    "puntaje a nota",
    "nota mínima",
    "calculadora notas chilenas",
    "promedio de notas",
    "escala 1.0 a 7.0",
    "calculadora académica chile",
    "notas estudiantes chile",
    "conversor puntaje nota",
    "calculadora notas universidad",
    "calculadora notas colegio"
  ],
  authors: [{ name: "NotaMinima", url: "https://notaminima.cl" }],
  creator: "NotaMinima",
  publisher: "NotaMinima",
  manifest: '/manifest.json',
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
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://notaminima.cl',
    siteName: 'NotaMinima',
    title: 'NotaMinima - Calculadora de Notas Chile',
    description: 'Calculadora gratuita de notas para estudiantes chilenos. Calcula promedios ponderados y convierte puntajes a notas.',
    images: [
      {
        url: '/logo-256.png',
        width: 256,
        height: 256,
        alt: 'NotaMinima Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'NotaMinima - Calculadora de Notas Chile',
    description: 'Calculadora gratuita de notas para estudiantes chilenos. Calcula promedios y convierte puntajes.',
    images: ['/logo-256.png'],
  },
  alternates: {
    canonical: 'https://notaminima.cl',
  },
  category: 'education',
  other: {
    'google-site-verification': 'pending',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="canonical" href="https://notaminima.cl" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NotaMinima" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo-256.png" />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
