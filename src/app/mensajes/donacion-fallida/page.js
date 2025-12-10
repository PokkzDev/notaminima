'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faHome,
  faRotateRight,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';
import styles from '../Mensajes.module.css';

export default function DonacionFallida() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.failedCard}>
          {/* Icon */}
          <div className={styles.iconFailed}>
            <FontAwesomeIcon icon={faHandHoldingHeart} />
          </div>

          {/* Title */}
          <h1 className={styles.titleFailed}>No te preocupes</h1>

          {/* Message */}
          <p className={styles.message}>
            Entendemos que a veces los pagos no se completan. No pasa nada, 
            estas cosas suceden y está todo bien.
          </p>

          {/* Understanding message */}
          <p className={styles.understandMessage}>
            NotaMinima seguirá siendo gratuito para ti siempre. Si en el futuro 
            quieres intentarlo de nuevo, estaremos muy agradecidos. Y si no, 
            también está perfecto — tu uso de la plataforma ya nos hace felices. 💙
          </p>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <a 
              href="https://www.flow.cl/btn.php?token=j40f75b03173c6d0b66ce5756c235f2ccebf1002" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.retryButton}
            >
              <FontAwesomeIcon icon={faRotateRight} />
              Intentar nuevamente
            </a>
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


