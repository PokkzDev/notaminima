'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faBullseye, 
  faFloppyDisk, 
  faRocket, 
  faCheckCircle,
  faCalculator,
  faGraduationCap,
  faLock,
  faCloud,
  faMobileScreen,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

export default function Home() {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [demoGrade, setDemoGrade] = useState(null);

  // Ensure component is mounted before using auth status to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Interactive demo animation
  useEffect(() => {
    if (!mounted) return;
    
    const grades = [6.5, 5.8, 6.2, 5.5, 6.8];
    let index = 0;
    
    const interval = setInterval(() => {
      setDemoGrade(grades[index]);
      index = (index + 1) % grades.length;
    }, 2000);
    
    return () => clearInterval(interval);
  }, [mounted]);

  // Determine the redirect URL based on authentication status
  const promedioHref = mounted && status === 'authenticated' ? '/promedio' : '/login';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NotaMinima',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CLP',
    },
    description: 'Calculadora gratuita de notas para estudiantes chilenos. Calcula promedios ponderados y convierte puntajes a notas en escala 1.0-7.0.',
    url: 'https://notaminima.cl',
    image: 'https://notaminima.cl/logo-256.png',
    author: {
      '@type': 'Organization',
      name: 'NotaMinima',
      url: 'https://notaminima.cl',
    },
    inLanguage: 'es-CL',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    featureList: [
      'Calculadora de promedio ponderado',
      'Conversor de puntaje a nota',
      'Gestión de múltiples cursos',
      'Almacenamiento local de datos',
      'Exportación e importación de datos',
      'Sin registro requerido',
    ],
  };

  return (
    <>
      <Script
        id="json-ld"
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
              <div className={styles.heroText}>
                <span className={styles.badge}>
                  <FontAwesomeIcon icon={faRocket} />
                  100% Gratis para estudiantes
                </span>
                <h1 className={styles.title}>
                  Deja de perder tiempo calculando tus <span className={styles.highlight}>notas</span>
                </h1>
                <p className={styles.description}>
                  La calculadora de notas más completa para estudiantes chilenos.
                  Calcula promedios ponderados, convierte puntajes y organiza tus cursos 
                  en segundos.
                </p>
                
                <ul className={styles.benefitsList}>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                    Promedio ponderado automático
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                    Escala chilena 1.0 - 7.0
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                    Guarda tus datos automáticamente
                  </li>
                </ul>
              
                <div className={styles.ctaGroup}>
                  <Link href={promedioHref} className={styles.primaryCta}>
                    <FontAwesomeIcon icon={faCalculator} />
                    Comenzar ahora
                    <FontAwesomeIcon icon={faArrowRight} className={styles.ctaArrow} />
                  </Link>
                  <Link href="/puntaje-a-nota" className={styles.secondaryCta}>
                    Convertir puntaje
                  </Link>
                </div>
              </div>
              
              {/* Interactive Demo Card */}
              <div className={styles.heroDemo}>
                <div className={styles.demoCard}>
                  <div className={styles.demoHeader}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <span>Calculadora de Promedio</span>
                  </div>
                  <div className={styles.demoBody}>
                    <div className={styles.demoRow}>
                      <span>Prueba 1 (30%)</span>
                      <span className={styles.demoGrade}>6.5</span>
                    </div>
                    <div className={styles.demoRow}>
                      <span>Prueba 2 (30%)</span>
                      <span className={styles.demoGrade}>5.8</span>
                    </div>
                    <div className={styles.demoRow}>
                      <span>Trabajo (40%)</span>
                      <span className={styles.demoGrade}>6.2</span>
                    </div>
                    <div className={styles.demoDivider}></div>
                    <div className={styles.demoResult}>
                      <span>Tu promedio</span>
                      <span className={`${styles.demoFinalGrade} ${styles.demoGradeAnimate}`}>
                        {demoGrade ? demoGrade.toFixed(1) : '6.2'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.demoFooter}>
                    <span className={styles.demoStatus}>
                      <span className={styles.statusDot}></span>
                      Aprobado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>1,000+</span>
                <span className={styles.statLabel}>Estudiantes activos</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>50,000+</span>
                <span className={styles.statLabel}>Notas calculadas</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Gratis para siempre</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Todo lo que necesitas para tus notas</h2>
              <p className={styles.sectionSubtitle}>
                Herramientas diseñadas específicamente para el sistema educativo chileno
              </p>
            </div>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <h3 className={styles.featureTitle}>Promedio Ponderado</h3>
                <p className={styles.featureText}>
                  Calcula tu promedio considerando el peso de cada evaluación. 
                  Agrega múltiples cursos y semestres.
                </p>
                <Link href="/promedio" className={styles.featureLink}>
                  Calcular promedio <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FontAwesomeIcon icon={faBullseye} />
                </div>
                <h3 className={styles.featureTitle}>Puntaje a Nota</h3>
                <p className={styles.featureText}>
                  Convierte cualquier puntaje a nota usando la fórmula oficial. 
                  Ajusta el porcentaje de exigencia.
                </p>
                <Link href="/puntaje-a-nota" className={styles.featureLink}>
                  Convertir puntaje <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </div>
                <h3 className={styles.featureTitle}>Guarda tus Datos</h3>
                <p className={styles.featureText}>
                  Tus notas se guardan automáticamente. Crea una cuenta gratuita 
                  para sincronizar entre dispositivos.
                </p>
                <Link href="/register" className={styles.featureLink}>
                  Crear cuenta <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className={styles.howItWorks}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Fácil de usar en 3 pasos</h2>
              <p className={styles.sectionSubtitle}>
                Empieza a calcular tus notas en menos de un minuto
              </p>
            </div>
            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.stepTitle}>Crea tu curso</h3>
                <p className={styles.stepText}>
                  Agrega el nombre de tu ramo y comienza a ingresar tus evaluaciones 
                  con sus respectivas ponderaciones.
                </p>
              </div>
              <div className={styles.stepConnector}>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.stepTitle}>Ingresa tus notas</h3>
                <p className={styles.stepText}>
                  Añade cada evaluación con su nota y porcentaje. El promedio 
                  se calcula automáticamente.
                </p>
              </div>
              <div className={styles.stepConnector}>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.stepTitle}>Revisa tu promedio</h3>
                <p className={styles.stepText}>
                  Visualiza tu promedio ponderado al instante. Simula notas 
                  futuras para planificar mejor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitsContent}>
                <h2 className={styles.benefitsTitle}>
                  ¿Por qué elegir NotaMinima?
                </h2>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <div>
                    <h4>Privacidad garantizada</h4>
                    <p>Tus datos se guardan en tu navegador. Sin registro, sin rastreo.</p>
                  </div>
                </div>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <FontAwesomeIcon icon={faCloud} />
                  </div>
                  <div>
                    <h4>Sincronización opcional</h4>
                    <p>Crea una cuenta gratuita para acceder desde cualquier dispositivo.</p>
                  </div>
                </div>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <FontAwesomeIcon icon={faMobileScreen} />
                  </div>
                  <div>
                    <h4>Funciona en todo dispositivo</h4>
                    <p>Diseñado para computadores, tablets y celulares.</p>
                  </div>
                </div>
              </div>
              <div className={styles.benefitsImage}>
                <div className={styles.gradeScalePreview}>
                  <div className={styles.scaleHeader}>Escala de Notas</div>
                  <div className={styles.scaleItem}>
                    <span className={styles.scaleRange}>7.0 - 6.0</span>
                    <span className={`${styles.scaleLabel} ${styles.scaleExcellent}`}>Excelente</span>
                  </div>
                  <div className={styles.scaleItem}>
                    <span className={styles.scaleRange}>5.9 - 5.0</span>
                    <span className={`${styles.scaleLabel} ${styles.scaleGood}`}>Muy Bueno</span>
                  </div>
                  <div className={styles.scaleItem}>
                    <span className={styles.scaleRange}>4.9 - 4.0</span>
                    <span className={`${styles.scaleLabel} ${styles.scalePass}`}>Aprobado</span>
                  </div>
                  <div className={styles.scaleItem}>
                    <span className={styles.scaleRange}>3.9 - 1.0</span>
                    <span className={`${styles.scaleLabel} ${styles.scaleFail}`}>Reprobado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.container}>
            <h2 className={styles.infoTitle}>El Sistema de Notas en Chile</h2>
            <div className={styles.infoContent}>
              <p className={styles.infoText}>
                En Chile, el sistema educativo utiliza una escala numérica del <strong>1.0 al 7.0</strong> para evaluar el desempeño académico. 
                La nota mínima para aprobar es <strong>4.0</strong>, lo que significa que cualquier calificación inferior representa una evaluación 
                reprobatoria. Este sistema es utilizado en todos los niveles educativos, desde la educación básica hasta la superior.
              </p>
              <p className={styles.infoText}>
                Nuestras herramientas están diseñadas específicamente para trabajar con este sistema, permitiéndote calcular 
                promedios ponderados considerando las ponderaciones de cada evaluación, y convertir puntajes brutos de exámenes 
                a notas según el porcentaje de exigencia establecido por tu institución educativa.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Comienza a calcular tus notas ahora</h2>
              <p className={styles.ctaText}>
                Es gratis, sin registro y tus datos permanecen en tu dispositivo.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/promedio" className={styles.ctaPrimary}>
                  <FontAwesomeIcon icon={faCalculator} />
                  Calcular Promedio
                </Link>
                <Link href="/escala-de-notas" className={styles.ctaSecondary}>
                  Ver Escala de Notas
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className={styles.linksSection}>
          <div className={styles.container}>
            <div className={styles.infoLinks}>
              <Link href="/acerca" className={styles.infoLink}>
                Conoce más sobre NotaMinima
              </Link>
              <Link href="/ayuda" className={styles.infoLink}>
                Consulta nuestra guía de ayuda
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}