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
import PropTypes from 'prop-types';
import PasswordComplexity from '@/app/components/PasswordComplexity';
import { isValidPassword } from '@/lib/validation';
import styles from './page.module.css';

// Helper to handle API requests with error handling
async function handleApiRequest(url, options, onSuccess, onError) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      onSuccess(data);
    } else {
      onError(data.error);
    }
  } catch (error) {
    console.error('API request error:', error);
    onError(null);
  }
}

// Loading component
function LoadingState() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    </main>
  );
}

// PropTypes for email form state
const emailFormShape = PropTypes.shape({
  newEmail: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.string.isRequired,
});

// PropTypes for password form state
const passwordFormShape = PropTypes.shape({
  currentPassword: PropTypes.string.isRequired,
  newPassword: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.string.isRequired,
});

// PropTypes for delete form state
const deleteFormShape = PropTypes.shape({
  password: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  showConfirm: PropTypes.bool.isRequired,
});

// Email change form section
function EmailChangeSection({ session, emailForm, setEmailForm }) {
  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailForm({ ...emailForm, loading: true, error: '', success: '' });

    await handleApiRequest(
      '/api/account/email',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForm.newEmail }),
      },
      (data) => {
        setEmailForm({
          newEmail: '',
          loading: false,
          error: '',
          success: data.message || 'Se ha enviado un email de verificación a la nueva dirección. Por favor revisa tu bandeja de entrada y haz clic en el enlace para completar el cambio.',
        });
      },
      (errorMsg) => {
        setEmailForm({
          ...emailForm,
          loading: false,
          error: errorMsg || 'Error al actualizar el email',
          success: '',
        });
      }
    );
  };

  return (
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
  );
}

EmailChangeSection.propTypes = {
  session: PropTypes.shape({
    user: PropTypes.shape({
      email: PropTypes.string,
    }),
  }),
  emailForm: emailFormShape.isRequired,
  setEmailForm: PropTypes.func.isRequired,
};

// Password change form section
function PasswordChangeSection({ passwordForm, setPasswordForm }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    await handleApiRequest(
      '/api/account/password',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      },
      () => {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          loading: false,
          error: '',
          success: 'Contraseña actualizada correctamente',
        });
      },
      (errorMsg) => {
        setPasswordForm({
          ...passwordForm,
          loading: false,
          error: errorMsg || 'Error al actualizar la contraseña',
          success: '',
        });
      }
    );
  };

  return (
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
  );
}

PasswordChangeSection.propTypes = {
  passwordForm: passwordFormShape.isRequired,
  setPasswordForm: PropTypes.func.isRequired,
};

// Account deletion form section
function DeleteAccountSection({ deleteForm, setDeleteForm }) {
  const [showDeletePassword, setShowDeletePassword] = useState(false);

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

    await handleApiRequest(
      '/api/account/delete',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deleteForm.password }),
      },
      () => {
        signOut({ callbackUrl: '/' });
      },
      (errorMsg) => {
        setDeleteForm({
          ...deleteForm,
          loading: false,
          error: errorMsg || 'Error al eliminar la cuenta',
        });
      }
    );
  };

  const handleCancelDelete = () => {
    setDeleteForm({ ...deleteForm, showConfirm: false, password: '', confirmText: '', error: '' });
  };

  const handleShowConfirm = () => {
    setDeleteForm({ ...deleteForm, showConfirm: true });
  };

  return (
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
        {deleteForm.showConfirm ? (
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
                onClick={handleCancelDelete}
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
        ) : (
          <button
            type="button"
            className={styles.dangerButton}
            onClick={handleShowConfirm}
          >
            Eliminar Mi Cuenta
          </button>
        )}
      </div>
    </section>
  );
}

DeleteAccountSection.propTypes = {
  deleteForm: deleteFormShape.isRequired,
  setDeleteForm: PropTypes.func.isRequired,
};

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

  // Account deletion state
  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmText: '',
    loading: false,
    error: '',
    showConfirm: false,
  });

  // Handle loading state
  if (status === 'loading') {
    return <LoadingState />;
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Configuración de Cuenta</h1>
          <p className={styles.subtitle}>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div className={styles.sectionsGrid}>
          <EmailChangeSection 
            session={session} 
            emailForm={emailForm} 
            setEmailForm={setEmailForm} 
          />

          <PasswordChangeSection 
            passwordForm={passwordForm} 
            setPasswordForm={setPasswordForm} 
          />
        </div>

        <DeleteAccountSection 
          deleteForm={deleteForm} 
          setDeleteForm={setDeleteForm} 
        />
      </div>
    </main>
  );
}

