'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { validatePasswordComplexity } from '@/lib/validation';
import styles from './PasswordComplexity.module.css';

export default function PasswordComplexity({ password }) {
  if (!password) {
    return null;
  }

  const validation = validatePasswordComplexity(password);

  return (
    <div className={styles.complexityContainer}>
      <div className={styles.complexityItem}>
        <FontAwesomeIcon
          icon={validation.minLength ? faCheck : faTimes}
          className={`${styles.icon} ${validation.minLength ? styles.iconValid : styles.iconInvalid}`}
        />
        <span className={validation.minLength ? styles.textValid : styles.textInvalid}>
          Más de 7 caracteres
        </span>
      </div>
      <div className={styles.complexityItem}>
        <FontAwesomeIcon
          icon={validation.hasSymbol ? faCheck : faTimes}
          className={`${styles.icon} ${validation.hasSymbol ? styles.iconValid : styles.iconInvalid}`}
        />
        <span className={validation.hasSymbol ? styles.textValid : styles.textInvalid}>
          Un símbolo
        </span>
      </div>
      <div className={styles.complexityItem}>
        <FontAwesomeIcon
          icon={validation.hasUppercase ? faCheck : faTimes}
          className={`${styles.icon} ${validation.hasUppercase ? styles.iconValid : styles.iconInvalid}`}
        />
        <span className={validation.hasUppercase ? styles.textValid : styles.textInvalid}>
          Una letra mayúscula
        </span>
      </div>
      <div className={styles.complexityItem}>
        <FontAwesomeIcon
          icon={validation.hasLowercase ? faCheck : faTimes}
          className={`${styles.icon} ${validation.hasLowercase ? styles.iconValid : styles.iconInvalid}`}
        />
        <span className={validation.hasLowercase ? styles.textValid : styles.textInvalid}>
          Una letra minúscula
        </span>
      </div>
      <div className={styles.complexityItem}>
        <FontAwesomeIcon
          icon={validation.hasNumber ? faCheck : faTimes}
          className={`${styles.icon} ${validation.hasNumber ? styles.iconValid : styles.iconInvalid}`}
        />
        <span className={validation.hasNumber ? styles.textValid : styles.textInvalid}>
          Un número
        </span>
      </div>
    </div>
  );
}





