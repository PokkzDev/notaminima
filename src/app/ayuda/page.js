'use client';

import Link from 'next/link';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faCalculator, faList, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import styles from './Ayuda.module.css';

export default function Ayuda() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'Ayuda y Preguntas Frecuentes - NotaMinima',
    description: 'Guía completa sobre cómo usar NotaMinima',
    url: 'https://notaminima.cl/ayuda',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cómo calculo mi promedio ponderado?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Para calcular tu promedio ponderado, agrega un curso, ingresa cada nota con su respectiva ponderación porcentual, y la calculadora calculará automáticamente tu promedio.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo convierto un puntaje a nota?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ingresa el puntaje obtenido, el puntaje total de la evaluación, y el porcentaje de exigencia. La herramienta calculará automáticamente la nota correspondiente en escala 1.0-7.0.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="json-ld-ayuda"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerIcon}>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </div>
            <h1 className={styles.title}>Ayuda y Preguntas Frecuentes</h1>
            <p className={styles.subtitle}>
              Guía completa para usar NotaMinima y entender el sistema de evaluación chileno
            </p>
          </header>

          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faCalculator} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Cómo Usar la Calculadora de Promedio</h2>
              </div>
              <div className={styles.sectionCard}>
              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Paso 1: Agregar un Curso</h3>
                <p className={styles.paragraph}>
                  Haz clic en el botón "Nuevo Curso" y escribe el nombre del curso que deseas agregar. 
                  Puedes agregar múltiples cursos para gestionar todas tus materias desde un solo lugar.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Paso 2: Agregar Notas</h3>
                <p className={styles.paragraph}>
                  Una vez que hayas creado un curso, haz clic en "Agregar Nota". Ingresa la nota obtenida 
                  (en escala 1.0-7.0) y su ponderación porcentual. Por ejemplo, si un examen vale 40% del curso, 
                  ingresa "40" en el campo de ponderación.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Paso 3: Calcular el Promedio</h3>
                <p className={styles.paragraph}>
                  El promedio se calcula automáticamente mientras agregas notas. Puedes ver el promedio acumulado 
                  en la parte superior de cada curso, junto con el porcentaje total evaluado hasta el momento.
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Simulador de Notas</h3>
                <p className={styles.paragraph}>
                  Si aún tienes evaluaciones pendientes, puedes usar el simulador para calcular qué nota necesitas 
                  obtener para alcanzar un promedio objetivo, o simular qué promedio final tendrías si obtienes 
                  una nota específica.
                </p>
              </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faCalculator} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Cómo Usar el Conversor de Puntaje a Nota</h2>
              </div>
              <div className={styles.sectionCard}>
              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Paso 1: Ingresar Puntaje Obtenido</h3>
                <p className={styles.paragraph}>
                  Ingresa el puntaje que obtuviste en la evaluación. Por ejemplo, si obtuviste 75 puntos de 100, 
                  ingresa "75" en el campo "Puntaje Obtenido".
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Paso 2: Ingresar Puntaje Total</h3>
                <p className={styles.paragraph}>
                  Ingresa el puntaje máximo posible de la evaluación. Siguiendo el ejemplo anterior, ingresa "100" 
                  en el campo "Puntaje Total".
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Paso 3: Ingresar Porcentaje de Exigencia</h3>
                <p className={styles.paragraph}>
                  El porcentaje de exigencia es el porcentaje mínimo necesario para aprobar. En Chile, este valor 
                  típicamente varía entre 50% y 70%. Si tu institución requiere 60% para aprobar, ingresa "60" 
                  en el campo "Exigencia (%)".
                </p>
              </div>

              <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Resultado</h3>
                <p className={styles.paragraph}>
                  La herramienta calculará automáticamente tu nota en escala 1.0-7.0, junto con el porcentaje 
                  obtenido y el estado (Aprobado o Reprobado).
                </p>
              </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faList} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
              </div>
              <div className={styles.sectionCard}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Qué es la ponderación?</h3>
                <p className={styles.faqAnswer}>
                  La ponderación es el porcentaje que representa cada evaluación dentro del total del curso. 
                  Por ejemplo, si un examen final vale 40% y tres tareas valen 20% cada una, la suma de todas 
                  las ponderaciones debe ser 100%. Es importante que las ponderaciones sumen exactamente 100% 
                  para obtener un promedio preciso.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Qué pasa si las ponderaciones no suman 100%?</h3>
                <p className={styles.faqAnswer}>
                  La calculadora te mostrará una advertencia indicando cuánto falta o cuánto excede. Si las 
                  ponderaciones suman menos de 100%, significa que aún faltan evaluaciones por agregar. Si suman 
                  más de 100%, deberás revisar y corregir las ponderaciones ingresadas.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Cómo funciona la fórmula de conversión de puntaje a nota?</h3>
                <p className={styles.faqAnswer}>
                  Si obtuviste un puntaje igual o mayor al mínimo requerido (exigencia), la nota se calcula entre 
                  4.0 y 7.0 usando la fórmula: Nota = 4.0 + 3.0 × ((puntaje_obtenido - puntaje_mínimo) / (puntaje_total - puntaje_mínimo)). 
                  Si obtuviste menos del mínimo, la nota se calcula entre 1.0 y 3.9 usando: Nota = 1.0 + 3.0 × (puntaje_obtenido / puntaje_mínimo).
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Mis datos se guardan automáticamente?</h3>
                <p className={styles.faqAnswer}>
                  Sí, todos tus cursos y notas se guardan automáticamente en el almacenamiento local de tu navegador. 
                  Sin embargo, recomendamos hacer copias de seguridad periódicas usando la función de exportación, 
                  especialmente si cambias de dispositivo o navegador.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Puedo usar esta herramienta sin conexión a internet?</h3>
                <p className={styles.faqAnswer}>
                  Una vez que la página esté cargada, puedes usar todas las funciones de cálculo sin conexión a internet. 
                  Sin embargo, necesitarás conexión para cargar la página inicialmente y para exportar/importar datos.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Qué significa el porcentaje de exigencia?</h3>
                <p className={styles.faqAnswer}>
                  El porcentaje de exigencia es el puntaje mínimo que necesitas obtener para aprobar la evaluación. 
                  Por ejemplo, si una evaluación tiene 100 puntos y la exigencia es 60%, necesitas obtener al menos 
                  60 puntos para conseguir un 4.0 (nota mínima de aprobación).
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Cómo puedo exportar mis datos?</h3>
                <p className={styles.faqAnswer}>
                  En la página de Promedio, haz clic en el botón "Exportar Datos". Esto descargará un archivo JSON 
                  con todos tus cursos y notas. Puedes guardar este archivo para hacer respaldos o transferirlo a 
                  otro dispositivo.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Cómo puedo importar datos?</h3>
                <p className={styles.faqAnswer}>
                  En la página de Promedio, haz clic en "Importar Datos" y selecciona un archivo JSON previamente 
                  exportado. El sistema validará el archivo antes de importarlo. Ten en cuenta que importar datos 
                  reemplazará todos tus cursos y notas actuales.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Por qué mi nota muestra decimales?</h3>
                <p className={styles.faqAnswer}>
                  Las notas se muestran con decimales para mayor precisión. El sistema educativo chileno permite notas 
                  con un decimal (por ejemplo, 5.7, 6.3). Nuestra calculadora muestra hasta dos decimales para cálculos 
                  intermedios, pero típicamente las notas finales se redondean a un decimal.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>¿Qué pasa si ingreso una nota inválida?</h3>
                <p className={styles.faqAnswer}>
                  El sistema valida automáticamente que las notas estén en el rango válido de 1.0 a 7.0. Si ingresas 
                  un valor fuera de este rango, el campo se marcará con un error y se ajustará automáticamente al 
                  salir del campo. Si ingresas un número mayor a 10 sin punto decimal, el sistema asumirá que olvidaste 
                  el punto y lo dividirá por 10 (por ejemplo, 65 se convierte en 6.5).
                </p>
              </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faLightbulb} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Tips y Consejos</h2>
              </div>
              <div className={styles.sectionCard}>
              <ul className={styles.tipsList}>
                <li>
                  <strong>Revisa las ponderaciones:</strong> Antes de calcular tu promedio, verifica que todas las 
                  ponderaciones sumen exactamente 100%. Esto asegura que tu promedio sea preciso.
                </li>
                <li>
                  <strong>Usa el simulador:</strong> Si tienes evaluaciones pendientes, usa el simulador para planificar 
                  qué notas necesitas obtener para alcanzar tus objetivos académicos.
                </li>
                <li>
                  <strong>Exporta regularmente:</strong> Haz copias de seguridad periódicas de tus datos usando la 
                  función de exportación para evitar perder información.
                </li>
                <li>
                  <strong>Verifica la exigencia:</strong> Cada institución puede tener diferentes porcentajes de 
                  exigencia. Asegúrate de usar el valor correcto al convertir puntajes a notas.
                </li>
                <li>
                  <strong>Gestiona múltiples cursos:</strong> Puedes agregar todos tus cursos y gestionarlos desde 
                  un solo lugar, facilitando el seguimiento de tu rendimiento académico general.
                </li>
              </ul>
              </div>
            </section>

            <div className={styles.highlight}>
              <h3 className={styles.highlightTitle}>¿Necesitas más ayuda?</h3>
              <p className={styles.highlightText}>
                Si tienes más preguntas o encuentras algún problema al usar NotaMinima, puedes revisar nuestra página 
                de información general en <Link href="/acerca" className={styles.link}>Acerca de NotaMinima</Link> 
                o contactarnos a través de nuestro sitio web.
              </p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

