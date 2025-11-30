import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Privacidad.module.css';

export const metadata = {
  title: "Política de Privacidad - NotaMinima",
  description: "Política de privacidad de NotaMinima. Protegemos tu privacidad y almacenamos tus datos académicos de forma segura en nuestros servidores.",
  keywords: [
    "política de privacidad",
    "privacidad notaminima",
    "protección de datos chile",
    "privacidad estudiantes",
    "datos locales",
    "GDPR chile",
  ],
  openGraph: {
    title: "Política de Privacidad - NotaMinima",
    description: "Política de privacidad de NotaMinima. Protegemos tu privacidad y almacenamos tus datos académicos de forma segura en nuestros servidores.",
    url: "https://notaminima.cl/privacidad",
    siteName: "NotaMinima",
    images: [
      {
        url: "/logo-256.png",
        width: 256,
        height: 256,
        alt: "NotaMinima - Política de Privacidad",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidad - NotaMinima",
    description: "Política de privacidad de NotaMinima. Protegemos tu privacidad y almacenamos tus datos académicos de forma segura en nuestros servidores.",
    images: ["/logo-256.png"],
  },
  alternates: {
    canonical: "https://notaminima.cl/privacidad",
  },
};

export default function PoliticaPrivacidad() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faShieldAlt} />
          </div>
          <h1 className={styles.title}>Política de Privacidad</h1>
          <p className={styles.subtitle}>
            Última actualización: {formattedDate}
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introducción</h2>
            <p className={styles.paragraph}>
              En NotaMinima, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad 
              explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando utiliza nuestro servicio.
            </p>
            <p className={styles.paragraph}>
              Al utilizar NotaMinima, usted acepta la recopilación y el uso de información de acuerdo con esta política.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Información que Recopilamos</h2>
            <p className={styles.paragraph}>
              <strong>Información de Cuenta (solo si crea una cuenta):</strong>
            </p>
            <p className={styles.paragraph}>
              Si decide crear una cuenta en NotaMinima, recopilamos la siguiente información:
            </p>
            <ul className={styles.list}>
              <li><strong>Dirección de correo electrónico:</strong> Requerida para crear la cuenta y verificar su identidad. Su email se almacena de forma segura y se utiliza únicamente para comunicaciones relacionadas con su cuenta (verificación, recuperación de contraseña, notificaciones importantes)</li>
              <li><strong>Nombre de usuario:</strong> Un identificador único que usted elige para su cuenta</li>
              <li><strong>Contraseña:</strong> Se almacena en forma encriptada (hash) utilizando algoritmos de seguridad estándar de la industria. Nunca almacenamos su contraseña en texto plano</li>
              <li><strong>Datos académicos:</strong> Si utiliza el Servicio con una cuenta, sus cursos, notas y cálculos se almacenan en nuestros servidores asociados a su cuenta</li>
              <li><strong>Información de sesión:</strong> Mantenemos registros de sesiones activas para seguridad y funcionalidad del servicio</li>
            </ul>
            <p className={styles.paragraph}>
              <strong>Información de Análisis (solo con su consentimiento):</strong>
            </p>
            <p className={styles.paragraph}>
              NotaMinima utiliza Google Analytics y Google AdSense únicamente después de obtener su consentimiento explícito 
              a través de nuestro banner de consentimiento de cookies. Estos servicios NO se cargan ni recopilan información 
              hasta que usted acepte el uso de cookies.
            </p>
            <p className={styles.paragraph}>
              Si acepta las cookies, Google Analytics (proporcionado por Google, Inc.) utiliza cookies para ayudarnos a analizar 
              cómo los usuarios utilizan el sitio. La información generada por las cookies sobre su uso del sitio web (incluyendo 
              su dirección IP) será transmitida y almacenada por Google en servidores en Estados Unidos.
            </p>
            <p className={styles.paragraph}>
              Google Analytics recopila información anónima sobre:
            </p>
            <ul className={styles.list}>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Tipo de navegador y sistema operativo</li>
              <li>Ubicación geográfica aproximada (país/ciudad)</li>
              <li>Dispositivo utilizado (escritorio, móvil, tablet)</li>
              <li>Forma en que llegó al sitio (referencia)</li>
            </ul>
            <p className={styles.paragraph}>
              Google utilizará esta información para evaluar su uso del sitio web, compilar informes sobre 
              la actividad del sitio web y proporcionar otros servicios relacionados con la actividad del 
              sitio web y el uso de Internet.
            </p>
            <p className={styles.paragraph}>
              <strong>Importante:</strong> Si rechaza las cookies, Google Analytics y Google AdSense NO se cargarán, 
              y no recopilaremos información de análisis. La funcionalidad principal del sitio seguirá funcionando 
              normalmente sin estas cookies.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Información que NO Recopilamos</h2>
            <p className={styles.paragraph}>
              Es importante destacar que:
            </p>
            <ul className={styles.list}>
              <li><strong>No recopilamos información personal innecesaria:</strong> Solo recopilamos la información mínima necesaria para proporcionar el servicio (email, nombre de usuario, contraseña)</li>
              <li><strong>No vendemos sus datos:</strong> Nunca venderemos, alquilaremos o compartiremos su información con terceros con fines comerciales</li>
              <li><strong>No compartimos sus datos académicos:</strong> Sus datos académicos (cursos, notas, cálculos) nunca se comparten con terceros</li>
              <li><strong>No utilizamos sus datos para publicidad dirigida personalizada:</strong> No utilizamos sus datos académicos para personalizar anuncios</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Almacenamiento de Datos Académicos</h2>
            <p className={styles.paragraph}>
              <strong>Almacenamiento en la nube:</strong>
            </p>
            <p className={styles.paragraph}>
              NotaMinima requiere que cree una cuenta para utilizar el servicio. Sus datos académicos se almacenan 
              en nuestros servidores asociados a su cuenta. Esto permite:
            </p>
            <ul className={styles.list}>
              <li>Acceder a sus datos desde múltiples dispositivos y navegadores</li>
              <li>Sincronización automática de sus datos entre dispositivos</li>
              <li>Mayor seguridad mediante copias de seguridad en nuestros servidores</li>
              <li>Protección contra pérdida de datos si cambia de dispositivo o navegador</li>
            </ul>
            <p className={styles.paragraph}>
              Sus datos académicos almacenados en la nube están:
            </p>
            <ul className={styles.list}>
              <li>Asociados únicamente a su cuenta y protegidos por autenticación</li>
              <li>Almacenados de forma segura en servidores con medidas de seguridad estándar de la industria</li>
              <li>Accesibles solo para usted mediante su cuenta</li>
              <li>Eliminados permanentemente cuando elimina su cuenta</li>
            </ul>
            <p className={styles.paragraph}>
              Sus datos académicos están siempre disponibles a través de su cuenta autenticada.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Seguridad de los Datos</h2>
            <p className={styles.paragraph}>
              <strong>Datos almacenados en la nube:</strong>
            </p>
            <p className={styles.paragraph}>
              Para proteger sus datos cuando tiene una cuenta, implementamos las siguientes medidas de seguridad:
            </p>
            <ul className={styles.list}>
              <li><strong>Encriptación de contraseñas:</strong> Las contraseñas se almacenan utilizando algoritmos de hash seguros (bcrypt) y nunca en texto plano</li>
              <li><strong>Autenticación segura:</strong> Utilizamos protocolos de autenticación estándar de la industria</li>
              <li><strong>Verificación de email:</strong> Requerimos verificación de email para prevenir cuentas fraudulentas</li>
              <li><strong>Protección de servidores:</strong> Implementamos medidas de seguridad estándar de la industria para proteger nuestros servidores</li>
              <li><strong>Acceso restringido:</strong> Solo usted puede acceder a sus datos mediante su cuenta autenticada</li>
            </ul>
            <p className={styles.paragraph}>
              Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro. 
              Aunque nos esforzamos por utilizar medios comercialmente aceptables para proteger su información personal, 
              no podemos garantizar su seguridad absoluta.
            </p>
            <p className={styles.paragraph}>
              Respecto a Google Analytics y Google AdSense, Google implementa medidas de seguridad estándar de la industria 
              para proteger la información recopilada.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Uso de Cookies y Consentimiento</h2>
            <p className={styles.paragraph}>
              NotaMinima respeta su privacidad y le da control total sobre el uso de cookies. Cuando visita nuestro sitio 
              por primera vez, se le mostrará un banner de consentimiento de cookies en la parte inferior de la pantalla 
              que le permite aceptar o rechazar el uso de cookies no esenciales.
            </p>
            <p className={styles.paragraph}>
              <strong>Tipos de Cookies:</strong>
            </p>
            <ul className={styles.list}>
              <li><strong>Cookies Esenciales:</strong> Estas cookies son necesarias para el funcionamiento básico del sitio 
              y no requieren consentimiento. Incluyen cookies de sesión y autenticación.</li>
              <li><strong>Cookies de Análisis (Google Analytics):</strong> Utilizadas para recopilar información anónima sobre 
              el uso del sitio web. Estas cookies SOLO se cargan si usted acepta el consentimiento de cookies.</li>
              <li><strong>Cookies de Publicidad (Google AdSense):</strong> Utilizadas para mostrar anuncios relevantes y medir 
              la efectividad de las campañas publicitarias. Estas cookies SOLO se cargan si usted acepta el consentimiento de cookies.</li>
            </ul>
            <p className={styles.paragraph}>
              <strong>Su Consentimiento:</strong>
            </p>
            <ul className={styles.list}>
              <li>Al hacer clic en &quot;Aceptar&quot; en el banner de cookies, usted consiente el uso de cookies de análisis y publicidad.</li>
              <li>Al hacer clic en &quot;Rechazar&quot;, estas cookies NO se cargarán y no recopilaremos información de análisis o publicidad.</li>
              <li>Su preferencia se guarda en su navegador (localStorage) y se respeta en futuras visitas.</li>
              <li>Puede cambiar su preferencia en cualquier momento eliminando la cookie de consentimiento de su navegador, 
              lo que hará que el banner vuelva a aparecer en su próxima visita.</li>
            </ul>
            <p className={styles.paragraph}>
              <strong>Gestión de Cookies:</strong>
            </p>
            <ul className={styles.list}>
              <li>Puede desactivar las cookies de Google Analytics instalando el complemento de inhabilitación para 
              navegadores de Google Analytics disponible en: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className={styles.link}>https://tools.google.com/dlpage/gaoptout</a></li>
              <li>Puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie.</li>
              <li>Puede eliminar las cookies almacenadas en su navegador en cualquier momento a través de la configuración de su navegador.</li>
              <li>Si rechaza las cookies de Analytics o AdSense, esto NO afectará la funcionalidad principal de la aplicación.</li>
            </ul>
            <p className={styles.paragraph}>
              <strong>Almacenamiento del Consentimiento:</strong> Su preferencia de consentimiento se almacena localmente en su navegador 
              (localStorage) con la clave &quot;notaminima_cookie_consent&quot;. Esta información se almacena solo en su dispositivo 
              y no se transmite a nuestros servidores. Puede eliminar esta preferencia en cualquier momento limpiando el almacenamiento 
              local de su navegador.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Servicios de Terceros</h2>
            <p className={styles.paragraph}>
              NotaMinima utiliza servicios de terceros para mejorar la funcionalidad del sitio:
            </p>
            <ul className={styles.list}>
              <li><strong>Google Analytics:</strong> Para análisis de uso del sitio web. Consulte la Política de Privacidad de Google en: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://policies.google.com/privacy</a></li>
              <li><strong>Google AdSense:</strong> Para mostrar anuncios relevantes en nuestro sitio web. Google utiliza cookies para personalizar anuncios según sus intereses y mostrar anuncios basados en sus visitas anteriores a este sitio u otros sitios web. Puede optar por no participar en la personalización de anuncios visitando <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className={styles.link}>Configuración de anuncios de Google</a>. Consulte la Política de Privacidad de Google AdSense en: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://policies.google.com/privacy</a></li>
            </ul>
            <p className={styles.paragraph}>
              Nuestro servicio también puede contener enlaces a sitios web de terceros que no son operados por nosotros. 
              Si hace clic en un enlace de terceros, será dirigido al sitio de ese tercero. Le recomendamos 
              encarecidamente que revise la Política de Privacidad de cada sitio que visite.
            </p>
            <p className={styles.paragraph}>
              No tenemos control sobre el contenido, las políticas de privacidad o las prácticas de sitios o 
              servicios de terceros, y no asumimos ninguna responsabilidad por ellos.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Privacidad de los Menores</h2>
            <p className={styles.paragraph}>
              Nuestro servicio está diseñado para estudiantes de todas las edades. Requerimos que los usuarios 
              tengan al menos 13 años de edad para crear una cuenta, o tener el consentimiento de un padre o tutor 
              si son menores de 13 años.
            </p>
            <p className={styles.paragraph}>
              Si usted es padre o tutor y sabe que su hijo menor de 13 años ha creado una cuenta sin su consentimiento, 
              o si tiene alguna preocupación sobre la información de su hijo, contáctenos inmediatamente para que 
              podamos investigar el asunto y eliminar la cuenta si es necesario.
            </p>
            <p className={styles.paragraph}>
              Si un menor crea una cuenta sin el consentimiento adecuado, podemos eliminar la cuenta y todos los datos asociados.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Transferencias Internacionales de Datos</h2>
            <p className={styles.paragraph}>
              La información recopilada por Google Analytics puede ser transferida y almacenada en servidores 
              ubicados fuera de Chile, incluyendo Estados Unidos. Al utilizar nuestro servicio, usted consiente 
              estas transferencias. Google cumple con el Marco de Privacidad de Datos aplicable para la transferencia 
              de información personal.
            </p>
            <p className={styles.paragraph}>
              Si tiene una cuenta, sus datos académicos y de cuenta se almacenan en servidores que pueden estar 
              ubicados fuera de Chile. Al crear una cuenta, usted consiente estas transferencias. Implementamos 
              medidas de seguridad apropiadas para proteger sus datos independientemente de su ubicación.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Sus Derechos de Privacidad</h2>
            <p className={styles.paragraph}>
              Usted tiene control completo sobre sus datos:
            </p>
            <p className={styles.paragraph}>
              <strong>Control de sus datos:</strong>
            </p>
            <ul className={styles.list}>
              <li><strong>Acceso:</strong> Puede acceder a todos sus datos académicos y de cuenta en cualquier momento a través de la interfaz de la aplicación</li>
              <li><strong>Modificación:</strong> Puede actualizar su información de cuenta (email, contraseña) en cualquier momento</li>
              <li><strong>Eliminación:</strong> Puede eliminar su cuenta y todos sus datos asociados en cualquier momento a través de la configuración de su cuenta. Una vez eliminada, todos sus datos serán eliminados permanentemente y no podrán ser recuperados</li>
              <li><strong>Derecho al olvido:</strong> Al eliminar su cuenta, eliminamos permanentemente todos sus datos personales y académicos de nuestros sistemas</li>
            </ul>
            <p className={styles.paragraph}>
              <strong>Para todos los usuarios:</strong>
            </p>
            <ul className={styles.list}>
              <li><strong>Control de Cookies:</strong> Puede aceptar o rechazar cookies no esenciales a través del banner de consentimiento 
              que aparece en su primera visita. Su preferencia se guarda y se respeta en futuras visitas.</li>
              <li><strong>Cambiar Preferencias de Cookies:</strong> Para cambiar su preferencia de cookies, elimine la entrada 
              &quot;notaminima_cookie_consent&quot; del almacenamiento local de su navegador. El banner de consentimiento volverá a aparecer 
              en su próxima visita.</li>
              <li><strong>Opt-out de Analytics:</strong> Puede optar por no participar en Google Analytics instalando el complemento de 
              inhabilitación mencionado anteriormente o rechazando las cookies cuando aparezca el banner</li>
              <li><strong>Gestión de Cookies:</strong> Puede controlar y eliminar cookies a través de la configuración de su navegador</li>
            </ul>
            <p className={styles.paragraph}>
              Si desea ejercer cualquiera de estos derechos o tiene preguntas sobre sus datos, puede contactarnos 
              a través de nuestra página web en <a href="https://pokkz.dev" target="_blank" rel="noopener noreferrer" className={styles.link}>pokkz.dev</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Retención de Datos</h2>
            <p className={styles.paragraph}>
              <strong>Datos de cuenta:</strong> Mantenemos su información de cuenta (email, nombre de usuario, contraseña encriptada) 
              mientras su cuenta esté activa. Si elimina su cuenta, eliminamos permanentemente todos sus datos de cuenta y académicos 
              de nuestros sistemas dentro de un plazo razonable.
            </p>
            <p className={styles.paragraph}>
              <strong>Datos académicos:</strong> Sus datos académicos se mantienen mientras su cuenta esté activa. 
              Al eliminar su cuenta, los datos se eliminan permanentemente.
            </p>
            <p className={styles.paragraph}>
              <strong>Datos de análisis:</strong> Los datos recopilados por Google Analytics (solo si usted aceptó las cookies) 
              se retienen según las políticas de retención de Google Analytics, típicamente hasta 26 meses. Si rechazó las cookies, 
              no se recopilan datos de análisis.
            </p>
            <p className={styles.paragraph}>
              <strong>Preferencia de consentimiento:</strong> Su preferencia de consentimiento de cookies se almacena localmente 
              en su navegador y se mantiene hasta que la elimine manualmente o limpie el almacenamiento local de su navegador.
            </p>
            <p className={styles.paragraph}>
              Podemos retener cierta información si es necesario para cumplir con obligaciones legales, resolver disputas, 
              o hacer cumplir nuestros acuerdos.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Cambios a Esta Política de Privacidad</h2>
            <p className={styles.paragraph}>
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos sobre cualquier 
              cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de 
              &quot;última actualización&quot;.
            </p>
            <p className={styles.paragraph}>
              Se le recomienda revisar esta Política de Privacidad periódicamente para estar al tanto de cualquier 
              cambio. Los cambios a esta Política de Privacidad son efectivos cuando se publican en esta página.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>13. Cumplimiento Legal</h2>
            <p className={styles.paragraph}>
              NotaMinima cumple con las leyes de privacidad aplicables en Chile, incluyendo la Ley N° 19.628 
              sobre Protección de la Vida Privada. El uso de Google Analytics y Google AdSense cumple con las 
              políticas de privacidad y términos de servicio de Google, que están diseñados para cumplir con 
              las regulaciones internacionales de protección de datos.
            </p>
            <p className={styles.paragraph}>
              Si tiene una cuenta, procesamos sus datos personales de acuerdo con esta Política de Privacidad 
              y las leyes aplicables. Usted tiene derecho a acceder, rectificar, eliminar u oponerse al 
              procesamiento de sus datos personales, sujeto a las limitaciones legales aplicables.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>14. Contacto</h2>
            <p className={styles.paragraph}>
              Si tiene alguna pregunta o inquietud sobre esta Política de Privacidad, puede contactarnos a través 
              de nuestra página web en <a href="https://pokkz.dev" target="_blank" rel="noopener noreferrer" className={styles.link}>pokkz.dev</a>.
            </p>
          </section>

          <div className={styles.highlight}>
            <h3 className={styles.highlightTitle}>En Resumen</h3>
            <p className={styles.highlightText}>
              NotaMinima requiere que cree una cuenta para utilizar el servicio. Recopilamos su email, nombre de usuario 
              y contraseña encriptada para proporcionarle acceso seguro al servicio. Sus datos académicos se almacenan 
              en nuestros servidores y nunca se comparten con terceros. El Servicio utiliza Google Analytics y Google 
              AdSense SOLO con su consentimiento explícito a través de nuestro banner de cookies. Si rechaza las cookies, 
              estos servicios no se cargan y no recopilamos información de análisis. Usted tiene control total sobre sus datos 
              y cookies, y puede cambiar sus preferencias en cualquier momento eliminando la preferencia de consentimiento 
              de su navegador.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

