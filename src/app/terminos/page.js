import Link from 'next/link';
import styles from './Terminos.module.css';

export const metadata = {
  title: "Términos de Uso - NotaMinima",
  description: "Términos y condiciones de uso de NotaMinima, calculadora de notas para estudiantes chilenos.",
};

export default function TerminosDeUso() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Términos de Uso</h1>
          <p className={styles.lastUpdated}>Última actualización: 6 de octubre de 2025</p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Aceptación de los Términos</h2>
            <p className={styles.paragraph}>
              Al acceder y utilizar NotaMinima ("el Servicio"), usted acepta estar sujeto a estos Términos de Uso. 
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Descripción del Servicio</h2>
            <p className={styles.paragraph}>
              NotaMinima es una herramienta educativa gratuita diseñada para ayudar a estudiantes chilenos a:
            </p>
            <ul className={styles.list}>
              <li>Calcular promedios de notas ponderados</li>
              <li>Convertir puntajes a notas según el sistema educativo chileno</li>
              <li>Gestionar y organizar sus evaluaciones académicas</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Uso Apropiado</h2>
            <p className={styles.paragraph}>
              Usted se compromete a utilizar el Servicio únicamente para fines legales y de acuerdo con estos Términos. 
              Específicamente, usted acepta no:
            </p>
            <ul className={styles.list}>
              <li>Utilizar el Servicio de manera que viole cualquier ley o regulación aplicable</li>
              <li>Intentar obtener acceso no autorizado a cualquier parte del Servicio</li>
              <li>Interferir con el funcionamiento normal del Servicio</li>
              <li>Transmitir cualquier material malicioso o código dañino</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Almacenamiento de Datos y Análisis</h2>
            <p className={styles.paragraph}>
              El Servicio almacena todos los datos académicos localmente en el navegador del usuario utilizando 
              localStorage. Esto significa que:
            </p>
            <ul className={styles.list}>
              <li>Sus datos académicos permanecen en su dispositivo y no se transmiten a ningún servidor externo</li>
              <li>Usted es responsable de hacer copias de seguridad de sus datos utilizando la función de exportación</li>
              <li>La eliminación del caché o datos del navegador resultará en la pérdida de sus datos guardados</li>
              <li>No somos responsables de la pérdida de datos almacenados localmente</li>
            </ul>
            <p className={styles.paragraph}>
              Adicionalmente, el Servicio utiliza Google Analytics para recopilar información anónima sobre el 
              uso del sitio web. Esta información incluye datos de navegación, pero no incluye sus datos académicos 
              personales (cursos, notas, cálculos). Para más información sobre cómo se recopilan y utilizan estos 
              datos, consulte nuestra Política de Privacidad.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Precisión de los Cálculos</h2>
            <p className={styles.paragraph}>
              Si bien hacemos nuestro mejor esfuerzo para proporcionar cálculos precisos, NotaMinima se proporciona 
              "tal cual" sin garantías de ningún tipo. Los usuarios deben:
            </p>
            <ul className={styles.list}>
              <li>Verificar todos los cálculos de manera independiente</li>
              <li>Consultar con sus instituciones educativas para confirmar los resultados</li>
              <li>No depender exclusivamente del Servicio para decisiones académicas importantes</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Uso de Cookies y Tecnologías de Seguimiento</h2>
            <p className={styles.paragraph}>
              El Servicio utiliza cookies a través de Google Analytics. Al utilizar el Servicio, usted acepta el 
              uso de estas cookies de acuerdo con nuestra Política de Privacidad. Puede desactivar las cookies 
              a través de la configuración de su navegador, aunque esto puede afectar su capacidad de utilizar 
              ciertas funciones analíticas del sitio (sin afectar la funcionalidad principal de la calculadora).
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Propiedad Intelectual</h2>
            <p className={styles.paragraph}>
              El Servicio y su contenido original, características y funcionalidad son propiedad de NotaMinima y 
              están protegidos por derechos de autor, marcas comerciales y otras leyes de propiedad intelectual.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Limitación de Responsabilidad</h2>
            <p className={styles.paragraph}>
              En ningún caso NotaMinima, sus directores, empleados, socios, agentes, proveedores o afiliados serán 
              responsables de cualquier daño directo, indirecto, incidental, especial, consecuente o punitivo, 
              incluyendo sin limitación, pérdida de beneficios, datos, uso, fondo de comercio u otras pérdidas 
              intangibles, resultantes de:
            </p>
            <ul className={styles.list}>
              <li>Su acceso o uso del Servicio</li>
              <li>Cualquier conducta o contenido de terceros en el Servicio</li>
              <li>Cualquier contenido obtenido del Servicio</li>
              <li>Acceso no autorizado, uso o alteración de sus transmisiones o contenido</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Modificaciones del Servicio</h2>
            <p className={styles.paragraph}>
              Nos reservamos el derecho de modificar o descontinuar, temporal o permanentemente, el Servicio 
              (o cualquier parte del mismo) con o sin previo aviso. No seremos responsables ante usted o ante 
              terceros por cualquier modificación, suspensión o interrupción del Servicio.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Cambios en los Términos</h2>
            <p className={styles.paragraph}>
              Nos reservamos el derecho de actualizar o cambiar nuestros Términos de Uso en cualquier momento. 
              Le notificaremos sobre cualquier cambio publicando los nuevos Términos de Uso en esta página y 
              actualizando la fecha de "última actualización" en la parte superior.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Ley Aplicable</h2>
            <p className={styles.paragraph}>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de Chile, sin dar efecto a 
              ninguna disposición de conflicto de leyes.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Contacto</h2>
            <p className={styles.paragraph}>
              Si tiene alguna pregunta sobre estos Términos de Uso, puede contactarnos a través de nuestra 
              página web en <a href="https://pokkz.dev" target="_blank" rel="noopener noreferrer" className={styles.link}>pokkz.dev</a>.
            </p>
          </section>
        </div>

        <div className={styles.footer}>
          <Link href="/" className={styles.backButton}>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

