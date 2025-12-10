'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faPaperPlane, faCheckCircle, faExclamationTriangle, faBug, faQuestion, faPenToSquare, faStar, faDesktop, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Sugerencias.module.css';

export default function Sugerencias() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo: 'sugerencia',
    plataforma: 'desktop',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const tiposSugerencia = [
    { value: 'sugerencia', label: 'Sugerencia', icon: faLightbulb },
    { value: 'error', label: 'Reportar Error', icon: faBug },
    { value: 'pregunta', label: 'Pregunta', icon: faQuestion },
    { value: 'otro', label: 'Otro', icon: faPenToSquare },
  ];

  const plataformas = [
    { value: 'desktop', label: 'Escritorio', icon: faDesktop },
    { value: 'mobile', label: 'Móvil', icon: faMobileAlt },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la sugerencia');
      }

      setSuccess(true);
      setFormData({
        nombre: '',
        email: '',
        tipo: 'sugerencia',
        plataforma: 'desktop',
        mensaje: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const caracteresRestantes = 2000 - formData.mensaje.length;

  if (success) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h1 className={styles.successTitle}>¡Gracias por tu mensaje!</h1>
            <p className={styles.successText}>
              Hemos recibido tu sugerencia y la revisaremos pronto. Tu opinión nos ayuda a mejorar NotaMinima.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className={styles.newSuggestionButton}
            >
              Enviar otra sugerencia
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faLightbulb} />
          </div>
          <h1 className={styles.title}>Buzón de Sugerencias</h1>
          <p className={styles.subtitle}>
            Tu opinión es muy importante para nosotros. Comparte tus ideas, reporta errores o haz preguntas.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre" className={styles.label}>
                Nombre <span className={styles.optional}>(opcional)</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className={styles.input}
                maxLength={100}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email <span className={styles.optional}>(opcional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className={styles.input}
              />
              <span className={styles.hint}>Si deseas recibir respuesta</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de mensaje</label>
            <div className={styles.tipoButtons}>
              {tiposSugerencia.map(tipo => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipo: tipo.value }))}
                  className={`${styles.tipoButton} ${formData.tipo === tipo.value ? styles.tipoButtonActive : ''}`}
                >
                  <span className={styles.tipoIcon}><FontAwesomeIcon icon={tipo.icon} /></span>
                  <span>{tipo.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Plataforma</label>
            <div className={styles.plataformaButtons}>
              {plataformas.map(plat => (
                <button
                  key={plat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, plataforma: plat.value }))}
                  className={`${styles.plataformaButton} ${formData.plataforma === plat.value ? styles.plataformaButtonActive : ''}`}
                >
                  <span className={styles.plataformaIcon}><FontAwesomeIcon icon={plat.icon} /></span>
                  <span>{plat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mensaje" className={styles.label}>
              Mensaje <span className={styles.required}>*</span>
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Cuéntanos tu sugerencia, describe el error que encontraste o haz tu pregunta..."
              className={styles.textarea}
              rows={6}
              maxLength={2000}
              required
            />
            <div className={styles.textareaFooter}>
              <span className={`${styles.charCount} ${caracteresRestantes < 100 ? styles.charCountWarning : ''}`}>
                {caracteresRestantes} caracteres restantes
              </span>
              <span className={styles.minChars}>Mínimo 10 caracteres</span>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || formData.mensaje.trim().length < 10}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Enviando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} />
                Enviar Sugerencia
              </>
            )}
          </button>
        </form>

        <div className={styles.infoCard}>
          <h3 className={styles.infoTitle}>¿Qué puedes compartir?</h3>
          <ul className={styles.infoList}>
            <li><span className={styles.infoBullet}><FontAwesomeIcon icon={faLightbulb} /></span> Ideas para nuevas funcionalidades</li>
            <li><span className={styles.infoBullet}><FontAwesomeIcon icon={faBug} /></span> Errores o problemas que hayas encontrado</li>
            <li><span className={styles.infoBullet}><FontAwesomeIcon icon={faQuestion} /></span> Preguntas sobre cómo usar la plataforma</li>
            <li><span className={styles.infoBullet}><FontAwesomeIcon icon={faStar} /></span> Feedback general sobre tu experiencia</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

