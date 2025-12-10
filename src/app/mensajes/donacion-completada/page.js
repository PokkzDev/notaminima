'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faHeart, 
  faHome,
  faCalculator
} from '@fortawesome/free-solid-svg-icons';
import styles from '../Mensajes.module.css';

export default function DonacionCompletada() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          {/* Confetti decoration */}
          <div className={styles.confetti}>
            <div className={styles.confettiPiece}></div>
            <div className={styles.confettiPiece}></div>
            <div className={styles.confettiPiece}></div>
            <div className={styles.confettiPiece}></div>
            <div className={styles.confettiPiece}></div>
          </div>

          {/* Success icon */}
          <div className={styles.iconSuccess}>
            <FontAwesomeIcon icon={faCheck} />
          </div>

          {/* Hearts */}
          <div className={styles.hearts}>
            <FontAwesomeIcon icon={faHeart} className={styles.heart} />
            <FontAwesomeIcon icon={faHeart} className={styles.heart} />
            <FontAwesomeIcon icon={faHeart} className={styles.heart} />
          </div>

          {/* Title */}
          <h1 className={styles.titleSuccess}>¡Muchísimas gracias!</h1>

          {/* Message */}
          <p className={styles.message}>
            Tu donación ha sido procesada exitosamente. Gracias por apoyar a NotaMinima 
            y ayudarnos a seguir siendo gratuitos para todos los estudiantes chilenos.
          </p>

          {/* Heart message */}
          <p className={styles.heartMessage}>
            Personas como tú hacen posible que miles de estudiantes puedan calcular sus notas 
            sin costo. Tu generosidad significa mucho para nosotros. 💚
          </p>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <Link href="/promedio" className={styles.primaryButton}>
              <FontAwesomeIcon icon={faCalculator} />
              Calcular promedio
            </Link>
            <Link href="/" className={styles.secondaryButton}>
              <FontAwesomeIcon icon={faHome} />
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}



