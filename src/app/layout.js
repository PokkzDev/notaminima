import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "NotaMinima - Calculadora de Notas",
  description: "Portal para estudiantes chilenos para calcular promedios y convertir puntajes a notas",
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
