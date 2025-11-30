import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import styles from './Terminos.module.css';

export const metadata = {
  title: "Términos de Uso - NotaMinima",
  description: "Términos y condiciones de uso de NotaMinima, calculadora de notas para estudiantes chilenos.",
  keywords: [
    "términos de uso",
    "condiciones de uso",
    "términos notaminima",
    "términos y condiciones chile",
    "uso del servicio",
  ],
  openGraph: {
    title: "Términos de Uso - NotaMinima",
    description: "Términos y condiciones de uso de NotaMinima, calculadora de notas para estudiantes chilenos.",
    url: "https://notaminima.cl/terminos",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Términos de Uso",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Términos de Uso - NotaMinima",
    description: "Términos y condiciones de uso de NotaMinima, calculadora de notas para estudiantes chilenos.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/terminos",
  },
};

export default function TerminosDeUso() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faFileContract} />
          </div>
          <h1 className={styles.title}>Términos de Uso</h1>
          <p className={styles.subtitle}>
            Última actualización: 9 de noviembre de 2025
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Aceptación de los Términos</h2>
            <p className={styles.paragraph}>
              Al acceder y utilizar NotaMinima (&quot;el Servicio&quot;), usted acepta estar sujeto a estos Términos de Uso. 
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
              <li>Crear cuentas para almacenar sus datos académicos en la nube y acceder desde cualquier dispositivo</li>
            </ul>
            <p className={styles.paragraph}>
              El Servicio requiere que cree una cuenta para utilizarlo. Sus datos académicos se almacenan en nuestros 
              servidores asociados a su cuenta, permitiendo acceso desde múltiples dispositivos y sincronización automática.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Creación y Uso de Cuentas</h2>
            <p className={styles.paragraph}>
              Para crear una cuenta en NotaMinima, usted debe:
            </p>
            <ul className={styles.list}>
              <li>Proporcionar una dirección de correo electrónico válida</li>
              <li>Crear un nombre de usuario único</li>
              <li>Establecer una contraseña segura que cumpla con nuestros requisitos de complejidad</li>
              <li>Verificar su dirección de correo electrónico mediante el enlace enviado a su email</li>
              <li>Tener al menos 13 años de edad (o tener el consentimiento de un padre o tutor si es menor)</li>
            </ul>
            <p className={styles.paragraph}>
              <strong>Responsabilidades de la Cuenta:</strong>
            </p>
            <ul className={styles.list}>
              <li>Usted es responsable de mantener la confidencialidad de sus credenciales de cuenta (email y contraseña)</li>
              <li>Usted es responsable de todas las actividades que ocurran bajo su cuenta</li>
              <li>Debe notificarnos inmediatamente de cualquier uso no autorizado de su cuenta</li>
              <li>No debe compartir su cuenta con terceros</li>
              <li>Debe proporcionar información precisa y actualizada al crear su cuenta</li>
              <li>No debe crear múltiples cuentas para evadir restricciones o límites del servicio</li>
            </ul>
            <p className={styles.paragraph}>
              Nos reservamos el derecho de suspender o terminar su cuenta si viola estos Términos de Uso, si proporciona información falsa, o si utilizamos nuestra discreción razonable para determinar que su uso del Servicio es perjudicial para otros usuarios o para nosotros.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Uso Apropiado</h2>
            <p className={styles.paragraph}>
              Usted se compromete a utilizar el Servicio únicamente para fines legales y de acuerdo con estos Términos. 
              Específicamente, usted acepta no:
            </p>
            <ul className={styles.list}>
              <li>Utilizar el Servicio de manera que viole cualquier ley o regulación aplicable</li>
              <li>Intentar obtener acceso no autorizado a cualquier parte del Servicio, otras cuentas de usuario, o sistemas informáticos</li>
              <li>Interferir con el funcionamiento normal del Servicio o sobrecargar nuestros servidores</li>
              <li>Transmitir cualquier material malicioso, código dañino, virus, o software malicioso</li>
              <li>Utilizar el Servicio para enviar spam, correos no solicitados, o comunicaciones comerciales no autorizadas</li>
              <li>Suplantar la identidad de otra persona o entidad</li>
              <li>Recopilar información de otros usuarios sin su consentimiento</li>
              <li>Utilizar el Servicio para cualquier propósito ilegal, fraudulento o no autorizado</li>
              <li>Intentar eludir o deshabilitar cualquier medida de seguridad del Servicio</li>
              <li>Utilizar robots, scripts automatizados, o métodos similares para acceder al Servicio sin autorización</li>
            </ul>
            <p className={styles.paragraph}>
              La violación de estas restricciones puede resultar en la terminación inmediata de su cuenta y puede exponerlo a responsabilidad civil y/o penal.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Almacenamiento de Datos y Análisis</h2>
            <p className={styles.paragraph}>
              <strong>Almacenamiento en la nube:</strong>
            </p>
            <p className={styles.paragraph}>
              El Servicio requiere que cree una cuenta. Sus datos académicos se almacenan en nuestros servidores 
              asociados a su cuenta. Esto permite:
            </p>
            <ul className={styles.list}>
              <li>Acceder a sus datos desde múltiples dispositivos</li>
              <li>Sincronización automática de sus datos entre dispositivos</li>
              <li>Mayor seguridad mediante copias de seguridad en nuestros servidores</li>
            </ul>
            <p className={styles.paragraph}>
              Al crear una cuenta, usted acepta que:
            </p>
            <ul className={styles.list}>
              <li>Sus datos académicos serán almacenados en nuestros servidores de forma segura</li>
              <li>Implementamos medidas de seguridad razonables para proteger sus datos, pero no podemos garantizar seguridad absoluta</li>
              <li>Usted mantiene la propiedad de sus datos académicos y puede eliminarlos en cualquier momento</li>
              <li>No somos responsables de la pérdida de datos debido a fallos técnicos, aunque haremos esfuerzos razonables para prevenir tales pérdidas</li>
              <li>Podemos eliminar su cuenta y datos asociados si viola estos Términos de Uso</li>
            </ul>
            <p className={styles.paragraph}>
              <strong>Análisis y Cookies:</strong>
            </p>
            <p className={styles.paragraph}>
              El Servicio utiliza Google Analytics y Google AdSense para recopilar información anónima sobre el 
              uso del sitio web. Esta información incluye datos de navegación, pero no incluye sus datos académicos 
              personales (cursos, notas, cálculos). Para más información sobre cómo se recopilan y utilizan estos 
              datos, consulte nuestra Política de Privacidad.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Precisión de los Cálculos</h2>
            <p className={styles.paragraph}>
              Si bien hacemos nuestro mejor esfuerzo para proporcionar cálculos precisos, NotaMinima se proporciona 
              &quot;tal cual&quot; sin garantías de ningún tipo. Los usuarios deben:
            </p>
            <ul className={styles.list}>
              <li>Verificar todos los cálculos de manera independiente</li>
              <li>Consultar con sus instituciones educativas para confirmar los resultados</li>
              <li>No depender exclusivamente del Servicio para decisiones académicas importantes</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Uso de Cookies y Tecnologías de Seguimiento</h2>
            <p className={styles.paragraph}>
              El Servicio utiliza cookies a través de Google Analytics. Al utilizar el Servicio, usted acepta el 
              uso de estas cookies de acuerdo con nuestra Política de Privacidad. Puede desactivar las cookies 
              a través de la configuración de su navegador, aunque esto puede afectar su capacidad de utilizar 
              ciertas funciones analíticas del sitio (sin afectar la funcionalidad principal de la calculadora).
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Terminación de Cuenta</h2>
            <p className={styles.paragraph}>
              Usted puede eliminar su cuenta en cualquier momento a través de la configuración de su cuenta. 
              Al eliminar su cuenta:
            </p>
            <ul className={styles.list}>
              <li>Todos sus datos académicos asociados a la cuenta serán eliminados permanentemente</li>
              <li>Su información de cuenta (email, nombre de usuario) será eliminada de nuestros sistemas</li>
              <li>No podrá recuperar sus datos después de la eliminación</li>
            </ul>
            <p className={styles.paragraph}>
              Nos reservamos el derecho de suspender o terminar su cuenta inmediatamente, sin previo aviso, 
              si determinamos que usted ha violado estos Términos de Uso, ha utilizado el Servicio de manera 
              fraudulenta o ilegal, o por cualquier otra razón que consideremos apropiada a nuestra sola discreción.
            </p>
            <p className={styles.paragraph}>
              En caso de terminación por nuestra parte, no tendremos ninguna obligación de proporcionar, mantener 
              o devolver sus datos académicos, aunque haremos esfuerzos razonables para permitirle exportar sus 
              datos antes de la terminación cuando sea posible.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Propiedad Intelectual</h2>
            <p className={styles.paragraph}>
              El Servicio y su contenido original, características y funcionalidad son propiedad de NotaMinima y 
              están protegidos por derechos de autor, marcas comerciales y otras leyes de propiedad intelectual.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Limitación de Responsabilidad</h2>
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
              <li>Pérdida o corrupción de datos académicos almacenados en nuestros servidores</li>
              <li>Interrupciones del servicio, fallos técnicos, o problemas de conectividad</li>
              <li>Errores en los cálculos proporcionados por el Servicio</li>
              <li>Decisiones académicas o profesionales tomadas basándose en los resultados del Servicio</li>
            </ul>
            <p className={styles.paragraph}>
              En ningún caso nuestra responsabilidad total hacia usted por todas las reclamaciones relacionadas 
              con el Servicio excederá el monto que haya pagado por el Servicio en los últimos doce meses, o 
              cero dólares si no ha pagado nada, ya que el Servicio es gratuito.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Modificaciones del Servicio</h2>
            <p className={styles.paragraph}>
              Nos reservamos el derecho de modificar o descontinuar, temporal o permanentemente, el Servicio 
              (o cualquier parte del mismo) con o sin previo aviso. No seremos responsables ante usted o ante 
              terceros por cualquier modificación, suspensión o interrupción del Servicio.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Cambios en los Términos</h2>
            <p className={styles.paragraph}>
              Nos reservamos el derecho de actualizar o cambiar nuestros Términos de Uso en cualquier momento. 
              Le notificaremos sobre cualquier cambio publicando los nuevos Términos de Uso en esta página y 
              actualizando la fecha de &quot;última actualización&quot; en la parte superior.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>13. Renuncia de Garantías</h2>
            <p className={styles.paragraph}>
              EL SERVICIO SE PROPORCIONA &quot;TAL CUAL&quot; Y &quot;SEGÚN DISPONIBILIDAD&quot; SIN GARANTÍAS DE NINGÚN TIPO, 
              YA SEAN EXPRESAS O IMPLÍCITAS, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD 
              PARA UN PROPÓSITO PARTICULAR, NO INFRACCIÓN O DISPONIBILIDAD CONTINUA. NO GARANTIZAMOS QUE EL SERVICIO 
              ESTÉ LIBRE DE ERRORES, VIRUS O OTROS COMPONENTES DAÑINOS, O QUE LOS DEFECTOS SERÁN CORREGIDOS.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>14. Indemnización</h2>
            <p className={styles.paragraph}>
              Usted acepta indemnizar, defender y eximir de responsabilidad a NotaMinima, sus directores, 
              empleados, agentes y afiliados de cualquier reclamación, responsabilidad, daño, pérdida o gasto 
              (incluyendo honorarios razonables de abogados) que surja de o esté relacionado con:
            </p>
            <ul className={styles.list}>
              <li>Su uso o mal uso del Servicio</li>
              <li>Su violación de estos Términos de Uso</li>
              <li>Su violación de cualquier derecho de terceros, incluyendo derechos de propiedad intelectual</li>
              <li>Cualquier contenido que usted envíe, publique o transmita a través del Servicio</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>15. Ley Aplicable</h2>
            <p className={styles.paragraph}>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de Chile, sin dar efecto a 
              ninguna disposición de conflicto de leyes.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>16. Contacto</h2>
            <p className={styles.paragraph}>
              Si tiene alguna pregunta sobre estos Términos de Uso, puede contactarnos a través de nuestra 
              página web en <a href="https://pokkz.dev" target="_blank" rel="noopener noreferrer" className={styles.link}>pokkz.dev</a>.
            </p>
          </section>

          <div className={styles.highlight}>
            <h3 className={styles.highlightTitle}>¿Necesitas más información?</h3>
            <p className={styles.highlightText}>
              Si tienes preguntas sobre estos términos o sobre cómo funciona NotaMinima, puedes visitar nuestra 
              página de <Link href="/ayuda" className={styles.link}>Ayuda</Link> o nuestra{' '}
              <Link href="/privacidad" className={styles.link}>Política de Privacidad</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

