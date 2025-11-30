/**
 * Email validation and normalization utilities
 */

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email format is valid
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const trimmedEmail = email.trim();
  
  // Length check to prevent ReDoS attacks
  if (trimmedEmail.length > 254) {
    return false;
  }
  
  // Simple email validation with atomic groups pattern to prevent backtracking
  // Checks: local-part@domain.tld format
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmedEmail);
}

/**
 * Normalizes email by trimming and converting to lowercase
 * @param {string} email - Email to normalize
 * @returns {string} - Normalized email
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return '';
  }
  return email.trim().toLowerCase();
}

/**
 * Password complexity validation utilities
 */

/**
 * Checks if password has more than 7 characters (at least 8)
 * @param {string} password - Password to check
 * @returns {boolean} - True if password has at least 8 characters
 */
export function hasMinLength(password) {
  return password && password.length > 7;
}

/**
 * Checks if password contains at least one symbol
 * @param {string} password - Password to check
 * @returns {boolean} - True if password contains a symbol
 */
export function hasSymbol(password) {
  if (!password) return false;
  return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
}

/**
 * Checks if password contains at least one uppercase letter
 * @param {string} password - Password to check
 * @returns {boolean} - True if password contains an uppercase letter
 */
export function hasUppercase(password) {
  if (!password) return false;
  return /[A-Z]/.test(password);
}

/**
 * Checks if password contains at least one lowercase letter
 * @param {string} password - Password to check
 * @returns {boolean} - True if password contains a lowercase letter
 */
export function hasLowercase(password) {
  if (!password) return false;
  return /[a-z]/.test(password);
}

/**
 * Checks if password contains at least one number
 * @param {string} password - Password to check
 * @returns {boolean} - True if password contains a number
 */
export function hasNumber(password) {
  if (!password) return false;
  return /\d/.test(password);
}

/**
 * Validates password meets all complexity requirements
 * @param {string} password - Password to validate
 * @returns {object} - Object with validation results for each requirement
 */
export function validatePasswordComplexity(password) {
  return {
    minLength: hasMinLength(password),
    hasSymbol: hasSymbol(password),
    hasUppercase: hasUppercase(password),
    hasLowercase: hasLowercase(password),
    hasNumber: hasNumber(password),
  };
}

/**
 * Checks if password meets all complexity requirements
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets all requirements
 */
export function isValidPassword(password) {
  if (!password) return false;
  const validation = validatePasswordComplexity(password);
  return (
    validation.minLength &&
    validation.hasSymbol &&
    validation.hasUppercase &&
    validation.hasLowercase &&
    validation.hasNumber
  );
}

