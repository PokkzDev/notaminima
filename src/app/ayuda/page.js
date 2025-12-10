'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faCalculator, 
  faChevronDown,
  faChevronUp,
  faUserPlus,
  faCloud,
  faFolderOpen,
  faChartLine,
  faBullseye,
  faLightbulb,
  faGraduationCap,
  faRocket,
  faShieldAlt,
  faTrophy,
  faArrowRight,
  faBook,
  faPercent,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import styles from './Ayuda.module.css';

const faqs = [
  {
    category: 'cuenta',
    question: '¿Necesito crear una cuenta para usar NotaMinima?',
    answer: 'No es obligatorio. Puedes usar todas las herramientas de cálculo sin registrarte. Sin embargo, al crear una cuenta gratuita, tus datos se guardan en la nube y puedes acceder desde cualquier dispositivo, organizar por semestres y carreras, y desbloquear logros en tu dashboard.'
  },
  {
    category: 'cuenta',
    question: '¿Cómo sincronizo mis datos entre dispositivos?',
    answer: 'Simplemente crea una cuenta gratuita e inicia sesión en cada dispositivo. Todos tus cursos, notas, semestres y carreras se sincronizarán automáticamente en la nube.'
  },
  {
    category: 'promedio',
    question: '¿Qué es la ponderación y cómo la uso?',
    answer: 'La ponderación es el porcentaje que representa cada evaluación dentro del curso. Por ejemplo, si un examen vale 40% y las tareas 60%, ingresa esos valores al agregar cada nota. Las ponderaciones deben sumar 100% para un cálculo preciso.'
  },
  {
    category: 'promedio',
    question: '¿Cómo organizo mis cursos en semestres y carreras?',
    answer: 'Con una cuenta, puedes crear carreras (ej: Ingeniería Civil) y dentro de cada carrera, crear semestres. Luego asigna tus cursos al semestre correspondiente. Esto te permite ver estadísticas por período y carrera en tu dashboard.'
  },
  {
    category: 'promedio',
    question: '¿Cómo agrego un examen final con ponderación especial?',
    answer: 'En cada curso, puedes habilitar el "Examen Final" que tiene su propia ponderación separada. Por ejemplo, si tu examen final vale 30% del curso, actívalo e ingresa la ponderación. El sistema calculará automáticamente considerando el examen y las notas regulares.'
  },
  {
    category: 'promedio',
    question: '¿Qué pasa si las ponderaciones no suman 100%?',
    answer: 'El sistema te mostrará una advertencia indicando el porcentaje faltante o excedente. Si suman menos de 100%, significa que faltan evaluaciones. Si suman más, revisa los valores ingresados. Puedes usar el simulador para calcular notas faltantes.'
  },
  {
    category: 'puntaje',
    question: '¿Cómo funciona la conversión de puntaje a nota?',
    answer: 'Ingresa el puntaje obtenido, el puntaje total de la evaluación y el porcentaje de exigencia (típicamente 60%). Si obtienes el puntaje de exigencia o más, tu nota estará entre 4.0 y 7.0. Si obtienes menos, estará entre 1.0 y 3.9.'
  },
  {
    category: 'puntaje',
    question: '¿Qué porcentaje de exigencia debo usar?',
    answer: 'El porcentaje de exigencia varía según la institución y tipo de evaluación. En Chile, comúnmente es 60%, pero puede variar entre 50% y 70%. Consulta con tu profesor o revisa el reglamento de tu institución.'
  },
  {
    category: 'sistema',
    question: '¿Cómo funciona la escala de notas chilena?',
    answer: 'Chile usa una escala del 1.0 al 7.0. La nota 4.0 es la mínima para aprobar. Las notas 6.0-7.0 son excelentes, 5.0-5.9 muy buenas, 4.0-4.9 suficientes para aprobar, y bajo 4.0 son reprobatorias.'
  },
  {
    category: 'dashboard',
    question: '¿Qué son los logros en el dashboard?',
    answer: 'Los logros son medallas que desbloqueas según tu progreso académico. Hay logros por cantidad de cursos, promedio general, tasa de aprobación, consistencia entre semestres, y más. ¡Es una forma divertida de celebrar tu avance!'
  },
  {
    category: 'dashboard',
    question: '¿Cómo se calcula la tendencia de mi promedio?',
    answer: 'La tendencia compara tu promedio del semestre actual con el anterior. Una flecha hacia arriba indica mejora, hacia abajo indica descenso, y el guión indica estabilidad (variación menor a 0.1).'
  },
  {
    category: 'datos',
    question: '¿Cómo exporto e importo mis datos?',
    answer: 'En la página de Promedio, usa los botones "Exportar" e "Importar" en la barra de herramientas. Exportar descarga un archivo JSON con todos tus datos. Importar te permite cargar ese archivo en otro navegador o restaurar una copia de seguridad.'
  },
  {
    category: 'datos',
    question: '¿Mis datos están seguros?',
    answer: 'Sí. Si no tienes cuenta, los datos se guardan localmente en tu navegador y nunca salen de tu dispositivo. Si tienes cuenta, se almacenan de forma segura en nuestros servidores con cifrado. Nunca compartimos información con terceros.'
  }
];

const categories = [
  { id: 'todos', label: 'Todas', icon: faQuestionCircle },
  { id: 'cuenta', label: 'Cuenta y Sync', icon: faCloud },
  { id: 'promedio', label: 'Calculadora', icon: faCalculator },
  { id: 'puntaje', label: 'Puntaje a Nota', icon: faBullseye },
  { id: 'sistema', label: 'Sistema Chileno', icon: faGraduationCap },
  { id: 'dashboard', label: 'Dashboard', icon: faChartLine },
  { id: 'datos', label: 'Datos', icon: faShieldAlt }
];

export default function Ayuda() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredFaqs = activeCategory === 'todos' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'Centro de Ayuda - NotaMinima',
    description: 'Preguntas frecuentes y guías de uso de NotaMinima',
    url: 'https://notaminima.cl/ayuda',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Script
        id="json-ld-ayuda"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroPattern}></div>
          </div>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <div className={styles.heroIcon}>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </div>
              <h1 className={styles.heroTitle}>Centro de Ayuda</h1>
              <p className={styles.heroSubtitle}>
                Todo lo que necesitas saber para sacarle el máximo provecho a NotaMinima
              </p>
            </div>
          </div>
        </section>

        <div className={styles.container}>
          {/* Quick Start Section */}
          <section className={styles.quickStart}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faRocket} className={styles.sectionIcon} />
              Guía Rápida
            </h2>
            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepIcon}>
                  <FontAwesomeIcon icon={faUserPlus} />
                </div>
                <h3>Crea tu cuenta</h3>
                <p>Regístrate gratis para guardar tus notas en la nube y acceder desde cualquier dispositivo.</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepIcon}>
                  <FontAwesomeIcon icon={faFolderOpen} />
                </div>
                <h3>Organiza tu carrera</h3>
                <p>Crea tu carrera y semestres para mantener todo organizado y ver estadísticas por período.</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepIcon}>
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <h3>Agrega tus cursos</h3>
                <p>Crea cursos e ingresa tus notas con sus ponderaciones. El promedio se calcula automáticamente.</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepIcon}>
                  <FontAwesomeIcon icon={faTrophy} />
                </div>
                <h3>Revisa tu dashboard</h3>
                <p>Visualiza tu progreso, desbloquea logros y analiza tu rendimiento académico.</p>
              </div>
            </div>
          </section>

          {/* Tools Overview */}
          <section className={styles.toolsSection}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faCalculator} className={styles.sectionIcon} />
              Nuestras Herramientas
            </h2>
            <div className={styles.toolsGrid}>
              <div className={styles.toolCard}>
                <div className={styles.toolHeader}>
                  <div className={styles.toolIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <FontAwesomeIcon icon={faCalculator} />
                  </div>
                  <h3>Calculadora de Promedio</h3>
                </div>
                <p>Calcula tu promedio ponderado considerando el peso de cada evaluación. Organiza por semestres y carreras.</p>
                <ul className={styles.toolFeatures}>
                  <li><FontAwesomeIcon icon={faLayerGroup} /> Múltiples cursos y semestres</li>
                  <li><FontAwesomeIcon icon={faPercent} /> Ponderación personalizada</li>
                  <li><FontAwesomeIcon icon={faLightbulb} /> Simulador de notas</li>
                </ul>
                <Link href="/promedio" className={styles.toolLink}>
                  Ir a la calculadora <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>

              <div className={styles.toolCard}>
                <div className={styles.toolHeader}>
                  <div className={styles.toolIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <FontAwesomeIcon icon={faBullseye} />
                  </div>
                  <h3>Puntaje a Nota</h3>
                </div>
                <p>Convierte cualquier puntaje a nota usando la fórmula oficial chilena con exigencia personalizable.</p>
                <ul className={styles.toolFeatures}>
                  <li><FontAwesomeIcon icon={faPercent} /> Exigencia ajustable (50-70%)</li>
                  <li><FontAwesomeIcon icon={faGraduationCap} /> Escala 1.0 - 7.0</li>
                  <li><FontAwesomeIcon icon={faLightbulb} /> Cálculo instantáneo</li>
                </ul>
                <Link href="/puntaje-a-nota" className={styles.toolLink}>
                  Ir al conversor <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>

              <div className={styles.toolCard}>
                <div className={styles.toolHeader}>
                  <div className={styles.toolIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <h3>Dashboard Académico</h3>
                </div>
                <p>Visualiza tu rendimiento con estadísticas detalladas, distribución de notas y logros desbloqueables.</p>
                <ul className={styles.toolFeatures}>
                  <li><FontAwesomeIcon icon={faTrophy} /> Sistema de logros</li>
                  <li><FontAwesomeIcon icon={faChartLine} /> Tendencia de notas</li>
                  <li><FontAwesomeIcon icon={faGraduationCap} /> Análisis por carrera</li>
                </ul>
                <Link href="/cuenta/dashboard" className={styles.toolLink}>
                  Ver dashboard <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faQuestionCircle} className={styles.sectionIcon} />
              Preguntas Frecuentes
            </h2>

            {/* Category Filter */}
            <div className={styles.categoryFilter}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.categoryButton} ${activeCategory === cat.id ? styles.categoryActive : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <FontAwesomeIcon icon={cat.icon} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className={styles.faqList}>
              {filteredFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`${styles.faqItem} ${expandedFaq === index ? styles.faqExpanded : ''}`}
                >
                  <button 
                    className={styles.faqQuestion}
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <FontAwesomeIcon 
                      icon={expandedFaq === index ? faChevronUp : faChevronDown} 
                      className={styles.faqChevron}
                    />
                  </button>
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaCard}>
              <h3>¿Listo para comenzar?</h3>
              <p>Empieza a calcular tus notas ahora. Es gratis y tus datos están seguros.</p>
              <div className={styles.ctaButtons}>
                <Link href="/register" className={styles.ctaPrimary}>
                  <FontAwesomeIcon icon={faUserPlus} />
                  Crear cuenta gratis
                </Link>
                <Link href="/promedio" className={styles.ctaSecondary}>
                  Usar sin cuenta
                </Link>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className={styles.contactSection}>
            <p>
              ¿No encontraste lo que buscabas? Visita nuestra página{' '}
              <Link href="/acerca" className={styles.link}>Acerca de NotaMinima</Link>{' '}
              o envíanos tus sugerencias en la sección de{' '}
              <Link href="/sugerencias" className={styles.link}>Sugerencias</Link>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
