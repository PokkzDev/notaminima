'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBullseye, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

export default function Home() {
  return (
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
            <Link href="/promedio" className={styles.primaryCta}>
              Calcular Promedio
            </Link>
            <Link href="/puntaje-a-nota" className={styles.secondaryCta}>
              Puntaje a Nota
            </Link>
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
    </main>
  );
}