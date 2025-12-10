'use client';

import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faGraduationCap, faCalculator, faShieldAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import styles from './Acerca.module.css';

export default function Acerca() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Acerca de NotaMinima',
    description: 'Información sobre NotaMinima y el sistema de evaluación chileno',
    url: 'https://notaminima.cl/acerca',
    mainEntity: {
      '@type': 'WebApplication',
      name: 'NotaMinima',
      applicationCategory: 'EducationalApplication',
      description: 'Calculadora gratuita de notas para estudiantes chilenos',
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
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerIcon}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
            <h1 className={styles.title}>Acerca de NotaMinima</h1>
            <p className={styles.subtitle}>
              Conoce más sobre nuestra plataforma y el sistema de evaluación chileno
            </p>
          </header>

          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faGraduationCap} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>¿Qué es NotaMinima?</h2>
              </div>
              <div className={styles.sectionCard}>
                <p className={styles.paragraph}>
                NotaMinima es un portal web diseñado específicamente para estudiantes chilenos que necesitan 
                calcular sus promedios académicos y convertir puntajes de evaluaciones a notas según el sistema 
                educativo chileno. Nuestra plataforma ofrece herramientas gratuitas, intuitivas y completamente 
                funcionales sin necesidad de registro, permitiendo a los estudiantes gestionar sus notas de manera 
                eficiente y precisa.
              </p>
              <p className={styles.paragraph}>
                El proyecto nació de la necesidad de proporcionar una solución simple y accesible para estudiantes 
                que constantemente deben calcular promedios ponderados y convertir puntajes a notas. Entendemos que 
                el sistema educativo chileno tiene particularidades que requieren herramientas específicas adaptadas 
                a su metodología de evaluación.
              </p>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faCalculator} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>El Sistema de Evaluación Chileno</h2>
              </div>
              <div className={styles.sectionCard}>
                <p className={styles.paragraph}>
                En Chile, el sistema de evaluación académica utiliza una escala numérica del 1.0 al 7.0, donde:
              </p>
              <ul className={styles.list}>
                <li><strong>4.0:</strong> Es la nota mínima para aprobar cualquier evaluación o curso.</li>
                <li><strong>1.0 a 3.9:</strong> Representan notas reprobatorias.</li>
                <li><strong>4.0 a 7.0:</strong> Representan notas aprobatorias, siendo 7.0 la calificación máxima.</li>
              </ul>
              <p className={styles.paragraph}>
                Este sistema es utilizado tanto en educación básica, media como superior, y cada institución 
                educativa puede establecer sus propios porcentajes de exigencia para las evaluaciones. La exigencia 
                típicamente varía entre 50% y 70%, dependiendo del nivel educativo y el tipo de evaluación.
              </p>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faCalculator} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>¿Cómo Funciona la Conversión de Puntajes a Notas?</h2>
              </div>
              <div className={styles.sectionCard}>
                <p className={styles.paragraph}>
                Cuando un estudiante realiza una evaluación y obtiene un puntaje bruto (por ejemplo, 75 puntos de 100), 
                este debe convertirse a una nota en la escala 1.0-7.0. La conversión depende del porcentaje de exigencia 
                establecido por la institución. Si la exigencia es del 60%, significa que se necesitan 60 puntos para 
                obtener un 4.0 (nota mínima de aprobación).
              </p>
              <p className={styles.paragraph}>
                Nuestra herramienta de conversión utiliza las fórmulas oficiales del sistema educativo chileno:
              </p>
              <ul className={styles.list}>
                <li>Si el puntaje obtenido es igual o mayor al puntaje mínimo (exigencia), la nota se calcula entre 4.0 y 7.0.</li>
                <li>Si el puntaje obtenido es menor al puntaje mínimo, la nota se calcula entre 1.0 y 3.9.</li>
              </ul>
              <p className={styles.paragraph}>
                Esta conversión asegura que los estudiantes puedan saber exactamente qué nota obtendrán según su desempeño 
                en las evaluaciones, facilitando la planificación de sus estudios y metas académicas.
              </p>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faCalculator} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Promedio Ponderado</h2>
              </div>
              <div className={styles.sectionCard}>
                <p className={styles.paragraph}>
                El promedio ponderado es el método más común para calcular la nota final de un curso en Chile. A diferencia 
                del promedio simple, donde todas las evaluaciones tienen el mismo peso, el promedio ponderado considera que 
                cada evaluación tiene un porcentaje específico del total. Por ejemplo, un examen final puede valer 40% del curso, 
                mientras que las tareas pueden valer 20% cada una.
              </p>
              <p className={styles.paragraph}>
                Nuestra calculadora de promedio permite a los estudiantes gestionar múltiples cursos simultáneamente, agregar 
                y editar notas con sus respectivas ponderaciones, y calcular automáticamente el promedio final. Además, incluye 
                funciones avanzadas como simuladores que permiten calcular qué nota se necesita para alcanzar un promedio objetivo 
                o simular el promedio final con una nota específica.
              </p>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faShieldAlt} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Privacidad y Seguridad</h2>
              </div>
              <div className={styles.sectionCard}>
                <p className={styles.paragraph}>
                En NotaMinima, la privacidad de nuestros usuarios es fundamental. Todos los datos académicos (cursos, notas, 
                cálculos) se almacenan únicamente en el navegador del usuario mediante tecnologías de almacenamiento local. 
                Esto significa que nunca enviamos información académica a servidores externos, garantizando que los estudiantes 
                tengan control total sobre sus datos.
              </p>
              <p className={styles.paragraph}>
                Los usuarios pueden exportar sus datos en formato JSON en cualquier momento para realizar copias de seguridad, 
                y también pueden importar datos previamente exportados. Esta funcionalidad permite que los estudiantes puedan 
                transferir sus datos entre dispositivos o hacer respaldos periódicos de su información académica.
              </p>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faHeart} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Nuestro Compromiso</h2>
              </div>
              <div className={styles.sectionCard}>
                <p className={styles.paragraph}>
                NotaMinima está comprometido con proporcionar herramientas educativas gratuitas y de calidad para estudiantes 
                chilenos. Buscamos simplificar procesos que pueden ser complejos o tediosos, permitiendo que los estudiantes 
                se enfoquen en lo que realmente importa: su aprendizaje y desarrollo académico.
              </p>
              <p className={styles.paragraph}>
                Continuamos mejorando nuestras herramientas basándonos en las necesidades reales de los estudiantes y en el 
                feedback que recibimos de nuestra comunidad de usuarios. Si tienes sugerencias o encuentras algún problema, 
                no dudes en contactarnos.
              </p>
                <div className={styles.supportSection}>
                  <p className={styles.supportText}>
                    Si NotaMinima te ha sido útil, considera apoyar el proyecto para mantenerlo gratuito y seguir mejorando.
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

            <div className={styles.highlight}>
              <h3 className={styles.highlightTitle}>En Resumen</h3>
              <p className={styles.highlightText}>
                NotaMinima es una plataforma gratuita diseñada para estudiantes chilenos que necesitan calcular promedios 
                ponderados y convertir puntajes a notas según el sistema educativo chileno. Todas las herramientas son 
                completamente funcionales sin necesidad de registro, y todos los datos se almacenan localmente en el navegador 
                del usuario, garantizando privacidad y seguridad total.
              </p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}


