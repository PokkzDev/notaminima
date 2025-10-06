import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
          <span className={styles.logoText}>NotaMinima</span>
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link href="/puntaje-a-nota" className={styles.navLink}>
              Puntaje a Nota
            </Link>
          </li>
          <li>
            <Link href="/promedio" className={styles.navLink}>
              Promedio
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
