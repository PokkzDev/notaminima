import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
          <span className={styles.logoText}>NotaMinima</span>
        </Link>

        <div className={styles.navLinksContainer}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/promedio" className={styles.navLink}>
                Promedio
              </Link>
            </li>
            <li>
              <Link href="/puntaje-a-nota" className={styles.navLink}>
                Puntaje a Nota
              </Link>
            </li>
          </ul>
          
          <div className={styles.separator}></div>
          
          <ul className={styles.navLinks}>
            <li>
              <Link href="/acerca" className={styles.navLink}>
                Acerca
              </Link>
            </li>
            <li>
              <Link href="/ayuda" className={styles.navLink}>
                Ayuda
              </Link>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
