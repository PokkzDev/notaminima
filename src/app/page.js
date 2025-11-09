'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBullseye, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import AdSense from './components/AdSense';
import styles from './page.module.css';

export default function Home() {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before using auth status to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

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
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              Calcula tus notas de forma <span className={styles.highlight}>simple y rápida</span>
            </h1>
            <p className={styles.description}>
              Portal diseñado para estudiantes chilenos. Calcula tu promedio de notas 
              o convierte puntajes a notas con nuestras herramientas intuitivas.
            </p>
          
          <div className={styles.ctaGroup}>
            <Link href={promedioHref} className={styles.primaryCta}>
              Calcular Promedio
            </Link>
            <Link href="/puntaje-a-nota" className={styles.secondaryCta}>
              Puntaje a Nota
            </Link>
            <Link href="/escala-de-notas" className={styles.secondaryCta}>
              Escala de Notas
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.adContainer}>
        <AdSense adSlot="" adFormat="auto" />
      </div>

      <section className={styles.infoSection}>
        <div className={styles.container}>
          <h2 className={styles.infoTitle}>¿Cómo Funciona el Sistema de Notas en Chile?</h2>
          <div className={styles.infoContent}>
            <p className={styles.infoText}>
              En Chile, el sistema educativo utiliza una escala numérica del 1.0 al 7.0 para evaluar el desempeño académico. 
              La nota mínima para aprobar es 4.0, lo que significa que cualquier calificación inferior representa una evaluación 
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

      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3 className={styles.featureTitle}>Promedio de Notas</h3>
              <p className={styles.featureText}>
                Calcula tu promedio académico de manera precisa y eficiente.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <h3 className={styles.featureTitle}>Puntaje a Nota</h3>
              <p className={styles.featureText}>
                Convierte puntajes de evaluaciones a notas según el sistema chileno.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FontAwesomeIcon icon={faFloppyDisk} />
              </div>
              <h3 className={styles.featureTitle}>Guarda tus Datos</h3>
              <p className={styles.featureText}>
                Tus cálculos se guardan localmente para acceder cuando lo necesites.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>¿Cómo Funciona?</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Calculadora de Promedio</h3>
              <p className={styles.stepText}>
                Gestiona múltiples cursos, agrega notas con sus respectivas ponderaciones y calcula automáticamente 
                tu promedio ponderado. Incluye simuladores para planificar tus evaluaciones futuras.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Conversor de Puntaje</h3>
              <p className={styles.stepText}>
                Convierte puntajes brutos de evaluaciones a notas en escala 1.0-7.0 según el sistema chileno. 
                Solo necesitas ingresar tu puntaje obtenido, el puntaje total y el porcentaje de exigencia.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Almacenamiento Local</h3>
              <p className={styles.stepText}>
                Todos tus datos se guardan automáticamente en tu navegador. Puedes exportar e importar tus 
                cursos y notas cuando lo necesites, manteniendo total control sobre tu información.
              </p>
            </div>
          </div>
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

      <div className={styles.adContainer}>
        <AdSense adSlot="" adFormat="auto" />
      </div>
      </main>
    </>
  );
}