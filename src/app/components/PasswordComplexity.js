'use client';

import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { validatePasswordComplexity } from '@/lib/validation';
import styles from './PasswordComplexity.module.css';

function ComplexityItem({ isValid, label }) {
  const icon = isValid ? faCheck : faTimes;
  const iconClass = `${styles.icon} ${isValid ? styles.iconValid : styles.iconInvalid}`;
  const textClass = isValid ? styles.textValid : styles.textInvalid;

  return (
    <div className={styles.complexityItem}>
      <FontAwesomeIcon icon={icon} className={iconClass} />
      <span className={textClass}>{label}</span>
    </div>
  );
}

ComplexityItem.propTypes = {
  isValid: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired
};

export default function PasswordComplexity({ password }) {
  if (!password) {
    return null;
  }

  const validation = validatePasswordComplexity(password);

  return (
    <div className={styles.complexityContainer}>
      <ComplexityItem isValid={validation.minLength} label="Más de 7 caracteres" />
      <ComplexityItem isValid={validation.hasSymbol} label="Un símbolo" />
      <ComplexityItem isValid={validation.hasUppercase} label="Una letra mayúscula" />
      <ComplexityItem isValid={validation.hasLowercase} label="Una letra minúscula" />
      <ComplexityItem isValid={validation.hasNumber} label="Un número" />
    </div>
  );
}

PasswordComplexity.propTypes = {
  password: PropTypes.string
};
