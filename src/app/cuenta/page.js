'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faTrash, 
  faExclamationTriangle,
  faCheck,
  faTimes,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import PasswordComplexity from '@/app/components/PasswordComplexity';
import { isValidPassword } from '@/lib/validation';
import styles from './page.module.css';

export default function CuentaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Email change state
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    loading: false,
    error: '',
    success: '',
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    loading: false,
    error: '',
    success: '',
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Account deletion state
  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmText: '',
    loading: false,
    error: '',
    showConfirm: false,
  });

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>Cargando...</div>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailForm({ ...emailForm, loading: true, error: '', success: '' });

    try {
      const response = await fetch('/api/account/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForm.newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailForm({
          ...emailForm,
          loading: false,
          error: data.error || 'Error al actualizar el email',
          success: '',
        });
        return;
      }

      setEmailForm({
        newEmail: '',
        loading: false,
        error: '',
        success: data.message || 'Se ha enviado un email de verificación a la nueva dirección. Por favor revisa tu bandeja de entrada y haz clic en el enlace para completar el cambio.',
      });
    } catch (error) {
      setEmailForm({
        ...emailForm,
        loading: false,
        error: 'Error al actualizar el email',
        success: '',
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordForm({ ...passwordForm, loading: true, error: '', success: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordForm({
        ...passwordForm,
        loading: false,
        error: 'Las contraseñas no coinciden',
        success: '',
      });
      return;
    }

    if (!isValidPassword(passwordForm.newPassword)) {
      setPasswordForm({
        ...passwordForm,
        loading: false,
        error: 'La nueva contraseña debe cumplir todos los requisitos de complejidad',
        success: '',
      });
      return;
    }

    try {
      const response = await fetch('/api/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordForm({
          ...passwordForm,
          loading: false,
          error: data.error || 'Error al actualizar la contraseña',
          success: '',
        });
        return;
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        loading: false,
        error: '',
        success: 'Contraseña actualizada correctamente',
      });
    } catch (error) {
      setPasswordForm({
        ...passwordForm,
        loading: false,
        error: 'Error al actualizar la contraseña',
        success: '',
      });
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (deleteForm.confirmText !== 'ELIMINAR') {
      setDeleteForm({
        ...deleteForm,
        error: 'Debes escribir "ELIMINAR" para confirmar',
      });
      return;
    }

    setDeleteForm({ ...deleteForm, loading: true, error: '' });

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deleteForm.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteForm({
          ...deleteForm,
          loading: false,
          error: data.error || 'Error al eliminar la cuenta',
        });
        return;
      }

      // Sign out and redirect
      signOut({ callbackUrl: '/' });
    } catch (error) {
      setDeleteForm({
        ...deleteForm,
        loading: false,
        error: 'Error al eliminar la cuenta',
      });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Configuración de Cuenta</h1>
          <p className={styles.subtitle}>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Email Change Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.sectionIcon} />
            Cambiar Email
          </h2>
          <div className={styles.sectionContent}>
            <p className={styles.currentInfo}>
              Email actual: <strong>{session?.user?.email}</strong>
            </p>
            <form onSubmit={handleEmailChange} className={styles.form}>
              {emailForm.error && (
                <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faTimes} /> {emailForm.error}
                </div>
              )}
              {emailForm.success && (
                <div className={styles.successMessage}>
                  <FontAwesomeIcon icon={faCheck} /> {emailForm.success}
                </div>
              )}
              <div className={styles.inputGroup}>
                <label htmlFor="newEmail" className={styles.label}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                  Nuevo Email
                </label>
                <input
                  id="newEmail"
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className={styles.input}
                  placeholder="nuevo@email.com"
                  required
                  disabled={emailForm.loading}
                />
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={emailForm.loading}
              >
                {emailForm.loading ? 'Actualizando...' : 'Actualizar Email'}
              </button>
            </form>
          </div>
        </section>

        {/* Password Change Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FontAwesomeIcon icon={faLock} className={styles.sectionIcon} />
            Cambiar Contraseña
          </h2>
          <div className={styles.sectionContent}>
            <form onSubmit={handlePasswordChange} className={styles.form}>
              {passwordForm.error && (
                <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faTimes} /> {passwordForm.error}
                </div>
              )}
              {passwordForm.success && (
                <div className={styles.successMessage}>
                  <FontAwesomeIcon icon={faCheck} /> {passwordForm.success}
                </div>
              )}
              <div className={styles.inputGroup}>
                <label htmlFor="currentPassword" className={styles.label}>
                  <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                  Contraseña Actual
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className={styles.input}
                    required
                    disabled={passwordForm.loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={passwordForm.loading}
                    aria-label={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                  Nueva Contraseña
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className={styles.input}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    disabled={passwordForm.loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={passwordForm.loading}
                    aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                <PasswordComplexity password={passwordForm.newPassword} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                  Confirmar Nueva Contraseña
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className={styles.input}
                    required
                    disabled={passwordForm.loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={passwordForm.loading}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={passwordForm.loading}
              >
                {passwordForm.loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </form>
          </div>
        </section>

        {/* Account Deletion Section */}
        <section className={`${styles.section} ${styles.dangerSection}`}>
          <h2 className={styles.sectionTitle}>
            <FontAwesomeIcon icon={faTrash} className={styles.sectionIcon} />
            Eliminar Cuenta
          </h2>
          <div className={styles.sectionContent}>
            <div className={styles.warningBox}>
              <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />
              <div>
                <strong>Advertencia:</strong> Esta acción no se puede deshacer. Al eliminar tu cuenta:
                <ul>
                  <li>Se eliminarán todos tus datos personales</li>
                  <li>Se perderán todos tus promedios guardados</li>
                  <li>No podrás recuperar tu cuenta</li>
                </ul>
              </div>
            </div>
            {!deleteForm.showConfirm ? (
              <button
                type="button"
                className={styles.dangerButton}
                onClick={() => setDeleteForm({ ...deleteForm, showConfirm: true })}
              >
                Eliminar Mi Cuenta
              </button>
            ) : (
              <form onSubmit={handleDeleteAccount} className={styles.form}>
                {deleteForm.error && (
                  <div className={styles.errorMessage}>
                    <FontAwesomeIcon icon={faTimes} /> {deleteForm.error}
                  </div>
                )}
                <div className={styles.inputGroup}>
                  <label htmlFor="deletePassword" className={styles.label}>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    Confirma tu Contraseña
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="deletePassword"
                      type={showDeletePassword ? 'text' : 'password'}
                      value={deleteForm.password}
                      onChange={(e) => setDeleteForm({ ...deleteForm, password: e.target.value })}
                      className={styles.input}
                      required
                      disabled={deleteForm.loading}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      disabled={deleteForm.loading}
                      aria-label={showDeletePassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      <FontAwesomeIcon icon={showDeletePassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmText" className={styles.label}>
                    Escribe <strong>ELIMINAR</strong> para confirmar
                  </label>
                  <input
                    id="confirmText"
                    type="text"
                    value={deleteForm.confirmText}
                    onChange={(e) => setDeleteForm({ ...deleteForm, confirmText: e.target.value })}
                    className={styles.input}
                    placeholder="ELIMINAR"
                    required
                    disabled={deleteForm.loading}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setDeleteForm({ ...deleteForm, showConfirm: false, password: '', confirmText: '', error: '' })}
                    disabled={deleteForm.loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.dangerButton}
                    disabled={deleteForm.loading || deleteForm.confirmText !== 'ELIMINAR'}
                  >
                    {deleteForm.loading ? 'Eliminando...' : 'Eliminar Cuenta Permanentemente'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

