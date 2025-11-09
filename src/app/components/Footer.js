import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.title}>NotaMinima</h3>
          <p className={styles.description}>
            Portal para estudiantes chilenos para calcular promedios y convertir puntajes a notas.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Herramientas</h4>
          <ul className={styles.links}>
            <li>
              <Link href="/login" className={styles.link}>
                Calcular Promedio
              </Link>
            </li>
            <li>
              <Link href="/puntaje-a-nota" className={styles.link}>
                Puntaje a Nota
              </Link>
            </li>
            <li>
              <Link href="/escala-de-notas" className={styles.link}>
                Escala de Notas
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información</h4>
          <ul className={styles.links}>
            <li>
              <Link href="/acerca" className={styles.link}>
                Acerca de
              </Link>
            </li>
            <li>
              <Link href="/ayuda" className={styles.link}>
                Ayuda
              </Link>
            </li>
            <li>
              <Link href="/terminos" className={styles.link}>
                Términos de Uso
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className={styles.link}>
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {currentYear} NotaMinima. Todos los derechos reservados.
        </p>
        <p className={styles.attribution}>
          Desarrollado por <a href="https://pokkz.dev" target="_blank" rel="noopener noreferrer" className={styles.attributionLink}>pokkz.dev</a>
        </p>
      </div>
    </footer>
  );
}
