import PropTypes from 'prop-types';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthProvider from "./components/AuthProvider";
import CookieConsent from "./components/CookieConsent";
import ConditionalScripts from "./components/ConditionalScripts";

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
    description: 'Calculadora gratuita de notas para estudiantes chilenos. Calcula promedios ponderados y convierte puntajes a notas en escala 1.0-7.0. Herramienta educativa sin registro.',
    images: [
      {
        url: '/logo-256.png',
        width: 256,
        height: 256,
        alt: 'NotaMinima - Calculadora de Notas Chile',
        type: 'image/png',
      },
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'NotaMinima - Calculadora de Notas Chile',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotaMinima - Calculadora de Notas Chile',
    description: 'Calculadora gratuita de notas para estudiantes chilenos. Calcula promedios ponderados y convierte puntajes a notas.',
    images: ['/logo-256.png'],
    creator: '@notaminima',
    site: '@notaminima',
  },
  alternates: {
    canonical: 'https://notaminima.cl',
  },
  category: 'education',
  classification: 'Educational Tool',
  other: {
    'google-site-verification': 'pending',
    'geo.region': 'CL',
    'geo.placename': 'Chile',
    'geo.position': '-33.4489;-70.6693',
    'ICBM': '-33.4489, -70.6693',
    'application-name': 'NotaMinima',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'NotaMinima',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#16a34a',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="apple-touch-icon" href="/logo-256.png" />
        <link rel="icon" type="image/png" href="/logo-256.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (!theme) {
                    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (systemPrefersDark) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            <Footer />
            <CookieConsent />
            <ConditionalScripts />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired
};
