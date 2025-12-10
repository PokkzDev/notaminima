'use client';

import Link from 'next/link';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faRocket,
  faShieldAlt,
  faCloud,
  faUsers,
  faGraduationCap,
  faCalculator,
  faBullseye,
  faChartLine,
  faTrophy,
  faCheck,
  faArrowRight,
  faMobileScreen,
  faLock,
  faCode,
  faLightbulb,
  faBook,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import styles from './Acerca.module.css';

const features = [
  {
    icon: faCalculator,
    title: 'Calculadora de Promedio',
    description: 'Calcula promedios ponderados con múltiples cursos, semestres y carreras. Incluye simulador de notas.',
    color: '#3b82f6'
  },
  {
    icon: faBullseye,
    title: 'Puntaje a Nota',
    description: 'Convierte puntajes a notas usando la fórmula oficial chilena con exigencia personalizable.',
    color: '#10b981'
  },
  {
    icon: faChartLine,
    title: 'Dashboard Académico',
    description: 'Visualiza tu rendimiento con estadísticas, distribución de notas y análisis por período.',
    color: '#8b5cf6'
  },
  {
    icon: faTrophy,
    title: 'Sistema de Logros',
    description: 'Desbloquea más de 50 logros diferentes basados en tu progreso y rendimiento académico.',
    color: '#f59e0b'
  },
  {
    icon: faCloud,
    title: 'Sincronización en la Nube',
    description: 'Crea una cuenta gratuita para acceder a tus datos desde cualquier dispositivo.',
    color: '#06b6d4'
  },
  {
    icon: faShieldAlt,
    title: 'Privacidad Total',
    description: 'Tus datos están protegidos. Sin cuenta, todo se guarda localmente en tu navegador.',
    color: '#ec4899'
  }
];

const stats = [
  { value: '100%', label: 'Gratis' },
  { value: '50+', label: 'Logros' },
  { value: '∞', label: 'Cursos' },
  { value: '0', label: 'Anuncios molestos' }
];

export default function Acerca() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Acerca de NotaMinima',
    description: 'NotaMinima es la plataforma gratuita más completa para calcular notas según el sistema educativo chileno',
    url: 'https://notaminima.cl/acerca',
    mainEntity: {
      '@type': 'WebApplication',
      name: 'NotaMinima',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description: 'Calculadora de notas y promedios para estudiantes chilenos',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CLP'
      }
    },
  };

  return (
    <>
      <Script
        id="json-ld-acerca"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroGradient}></div>
            <div className={styles.heroPattern}></div>
          </div>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <FontAwesomeIcon icon={faGraduationCap} />
                <span>Para estudiantes chilenos</span>
              </div>
              <h1 className={styles.heroTitle}>
                La forma más <span className={styles.highlight}>fácil</span> de calcular tus notas
              </h1>
              <p className={styles.heroSubtitle}>
                NotaMinima es la plataforma gratuita más completa para gestionar tu rendimiento 
                académico en Chile. Calcula promedios, convierte puntajes y visualiza tu progreso.
              </p>
              <div className={styles.heroStats}>
                {stats.map((stat, index) => (
                  <div key={index} className={styles.heroStatItem}>
                    <span className={styles.heroStatValue}>{stat.value}</span>
                    <span className={styles.heroStatLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.missionSection}>
          <div className={styles.container}>
            <div className={styles.missionGrid}>
              <div className={styles.missionContent}>
                <h2 className={styles.sectionTitle}>
                  <FontAwesomeIcon icon={faLightbulb} className={styles.sectionIcon} />
                  Nuestra Misión
                </h2>
                <p className={styles.missionText}>
                  NotaMinima nació de una necesidad simple: los estudiantes chilenos necesitaban 
                  una herramienta gratuita, rápida y confiable para calcular sus notas según el 
                  sistema educativo local.
                </p>
                <p className={styles.missionText}>
                  Hoy, NotaMinima es mucho más que una calculadora. Es una plataforma completa 
                  que te ayuda a organizar tu vida académica, visualizar tu progreso y mantenerte 
                  motivado con un sistema de logros único.
                </p>
                <div className={styles.missionPoints}>
                  <div className={styles.missionPoint}>
                    <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                    <span>Diseñado específicamente para Chile</span>
                  </div>
                  <div className={styles.missionPoint}>
                    <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                    <span>100% gratuito, sin funciones premium ocultas</span>
                  </div>
                  <div className={styles.missionPoint}>
                    <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                    <span>Respetamos tu privacidad y tus datos</span>
                  </div>
                </div>
              </div>
              <div className={styles.missionVisual}>
                <div className={styles.scaleCard}>
                  <div className={styles.scaleHeader}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <span>Escala Chilena</span>
                  </div>
                  <div className={styles.scaleBody}>
                    <div className={styles.scaleRow}>
                      <span className={styles.scaleRange}>7.0 - 6.0</span>
                      <span className={`${styles.scaleLabel} ${styles.excellent}`}>Excelente</span>
                    </div>
                    <div className={styles.scaleRow}>
                      <span className={styles.scaleRange}>5.9 - 5.0</span>
                      <span className={`${styles.scaleLabel} ${styles.good}`}>Muy Bueno</span>
                    </div>
                    <div className={styles.scaleRow}>
                      <span className={styles.scaleRange}>4.9 - 4.0</span>
                      <span className={`${styles.scaleLabel} ${styles.pass}`}>Aprobado</span>
                    </div>
                    <div className={styles.scaleRow}>
                      <span className={styles.scaleRange}>3.9 - 1.0</span>
                      <span className={`${styles.scaleLabel} ${styles.fail}`}>Reprobado</span>
                    </div>
                  </div>
                  <div className={styles.scaleFooter}>
                    <span>4.0 = Nota mínima de aprobación</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.container}>
            <div className={styles.featuresHeader}>
              <h2 className={styles.sectionTitleCentered}>Todo lo que necesitas</h2>
              <p className={styles.featuresSubtitle}>
                Herramientas completas para cada aspecto de tu vida académica
              </p>
            </div>
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                  <div 
                    className={styles.featureIcon} 
                    style={{ background: `linear-gradient(135deg, ${feature.color}22, ${feature.color}11)` }}
                  >
                    <FontAwesomeIcon icon={feature.icon} style={{ color: feature.color }} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className={styles.howSection}>
          <div className={styles.container}>
            <div className={styles.howHeader}>
              <h2 className={styles.sectionTitleCentered}>
                <FontAwesomeIcon icon={faBook} className={styles.sectionIcon} />
                El Sistema de Notas en Chile
              </h2>
            </div>
            <div className={styles.howContent}>
              <div className={styles.howCard}>
                <h3>Escala de Calificaciones</h3>
                <p>
                  Chile utiliza una escala numérica del <strong>1.0 al 7.0</strong> para evaluar 
                  el desempeño académico. La nota <strong>4.0</strong> es la mínima para aprobar, 
                  lo que significa que cualquier calificación inferior es reprobatoria. Este sistema 
                  se utiliza en todos los niveles educativos.
                </p>
              </div>
              <div className={styles.howCard}>
                <h3>Porcentaje de Exigencia</h3>
                <p>
                  El porcentaje de exigencia determina cuántos puntos necesitas para aprobar. 
                  En Chile típicamente varía entre <strong>50% y 70%</strong>. Si la exigencia 
                  es 60% y el total es 100 puntos, necesitas 60 puntos para obtener un 4.0.
                </p>
              </div>
              <div className={styles.howCard}>
                <h3>Promedio Ponderado</h3>
                <p>
                  El promedio ponderado considera el peso de cada evaluación. Si un examen vale 
                  40% y las tareas 60%, el promedio final refleja esa proporción. NotaMinima 
                  calcula esto automáticamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className={styles.privacySection}>
          <div className={styles.container}>
            <div className={styles.privacyGrid}>
              <div className={styles.privacyContent}>
                <h2 className={styles.sectionTitle}>
                  <FontAwesomeIcon icon={faShieldAlt} className={styles.sectionIcon} />
                  Privacidad y Seguridad
                </h2>
                <p className={styles.privacyText}>
                  En NotaMinima, tu privacidad es prioridad. Tienes control total sobre tus datos 
                  y cómo se almacenan.
                </p>
                <div className={styles.privacyOptions}>
                  <div className={styles.privacyOption}>
                    <div className={styles.privacyOptionIcon}>
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <div>
                      <h4>Sin cuenta</h4>
                      <p>Tus datos se guardan solo en tu navegador. Nunca salen de tu dispositivo.</p>
                    </div>
                  </div>
                  <div className={styles.privacyOption}>
                    <div className={styles.privacyOptionIcon}>
                      <FontAwesomeIcon icon={faCloud} />
                    </div>
                    <div>
                      <h4>Con cuenta</h4>
                      <p>Sincronización segura con cifrado. Accede desde cualquier dispositivo.</p>
                    </div>
                  </div>
                  <div className={styles.privacyOption}>
                    <div className={styles.privacyOptionIcon}>
                      <FontAwesomeIcon icon={faCode} />
                    </div>
                    <div>
                      <h4>Sin rastreo</h4>
                      <p>No vendemos ni compartimos tus datos con terceros. Sin publicidad invasiva.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.privacyVisual}>
                <div className={styles.deviceStack}>
                  <div className={styles.deviceCard}>
                    <FontAwesomeIcon icon={faMobileScreen} />
                    <span>Celular</span>
                  </div>
                  <div className={styles.deviceCard}>
                    <FontAwesomeIcon icon={faCalculator} />
                    <span>Tablet</span>
                  </div>
                  <div className={styles.deviceCard}>
                    <FontAwesomeIcon icon={faCode} />
                    <span>Computador</span>
                  </div>
                </div>
                <p className={styles.deviceText}>Funciona en todos tus dispositivos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className={styles.supportSection}>
          <div className={styles.container}>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h2>¿Te gusta NotaMinima?</h2>
              <p>
                NotaMinima es y siempre será gratuito. Si te ha sido útil, considera apoyar 
                el proyecto para que podamos seguir mejorando y manteniéndolo online.
              </p>
              <a 
                href="https://www.flow.cl/btn.php?token=j40f75b03173c6d0b66ce5756c235f2ccebf1002" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.donateButton}
              >
                <FontAwesomeIcon icon={faHeart} />
                Apoyar NotaMinima
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2>Empieza a usar NotaMinima hoy</h2>
              <p>Es gratis, sin registro obligatorio, y tus datos están seguros.</p>
              <div className={styles.ctaButtons}>
                <Link href="/register" className={styles.ctaPrimary}>
                  <FontAwesomeIcon icon={faUserPlus} />
                  Crear cuenta gratis
                </Link>
                <Link href="/promedio" className={styles.ctaSecondary}>
                  Calcular promedio
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className={styles.linksSection}>
          <div className={styles.container}>
            <div className={styles.linksList}>
              <Link href="/ayuda" className={styles.pageLink}>
                <FontAwesomeIcon icon={faBook} />
                Centro de Ayuda
              </Link>
              <Link href="/sugerencias" className={styles.pageLink}>
                <FontAwesomeIcon icon={faLightbulb} />
                Sugerencias
              </Link>
              <Link href="/privacidad" className={styles.pageLink}>
                <FontAwesomeIcon icon={faShieldAlt} />
                Privacidad
              </Link>
              <Link href="/terminos" className={styles.pageLink}>
                <FontAwesomeIcon icon={faCode} />
                Términos
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
