import Link from 'next/link';
import styles from './Privacidad.module.css';

export const metadata = {
  title: "Política de Privacidad - NotaMinima",
  description: "Política de privacidad de NotaMinima. Protegemos tu privacidad: no recopilamos información personal y todos los datos se almacenan localmente.",
};

export default function PoliticaPrivacidad() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Política de Privacidad</h1>
          <p className={styles.lastUpdated}>Última actualización: 6 de octubre de 2025</p>
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
              NotaMinima utiliza Google Analytics, un servicio de análisis web proporcionado por Google, Inc. 
              Google Analytics utiliza cookies para ayudarnos a analizar cómo los usuarios utilizan el sitio. 
              La información generada por las cookies sobre su uso del sitio web (incluyendo su dirección IP) 
              será transmitida y almacenada por Google en servidores en Estados Unidos.
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
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Información que NO Recopilamos</h2>
            <p className={styles.paragraph}>
              Es importante destacar que:
            </p>
            <ul className={styles.list}>
              <li><strong>No recopilamos información personal identificable directamente:</strong> No solicitamos ni almacenamos nombres, correos electrónicos, números de teléfono u otra información personal</li>
              <li><strong>No utilizamos servidores para almacenar sus datos académicos:</strong> Todos sus cursos, notas y cálculos se almacenan localmente en su dispositivo</li>
              <li><strong>No vendemos sus datos:</strong> Nunca venderemos, alquilaremos o compartiremos su información con terceros con fines comerciales</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Almacenamiento Local de Datos Académicos</h2>
            <p className={styles.paragraph}>
              NotaMinima utiliza la tecnología localStorage del navegador web para almacenar sus datos académicos. 
              Esto significa que:
            </p>
            <ul className={styles.list}>
              <li>Todos sus cursos, notas y cálculos se guardan únicamente en su dispositivo</li>
              <li>Sus datos académicos nunca se transmiten a nuestros servidores ni a ningún servidor externo</li>
              <li>Solo usted tiene acceso a sus datos académicos</li>
              <li>Los datos permanecen en su navegador hasta que usted los elimine manualmente o limpie el caché del navegador</li>
              <li>Puede exportar sus datos en cualquier momento utilizando la función de exportación</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Seguridad de los Datos</h2>
            <p className={styles.paragraph}>
              Dado que todos los datos académicos se almacenan localmente en su dispositivo:
            </p>
            <ul className={styles.list}>
              <li>La seguridad de sus datos académicos depende de la seguridad de su dispositivo y navegador</li>
              <li>Recomendamos utilizar un dispositivo seguro con software actualizado</li>
              <li>Le sugerimos hacer copias de seguridad periódicas utilizando la función de exportación</li>
              <li>Si comparte su dispositivo con otros, tenga en cuenta que podrían acceder a sus datos si tienen acceso a su navegador</li>
            </ul>
            <p className={styles.paragraph}>
              Respecto a Google Analytics, Google implementa medidas de seguridad estándar de la industria 
              para proteger la información recopilada.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Uso de Cookies</h2>
            <p className={styles.paragraph}>
              NotaMinima utiliza cookies únicamente a través de Google Analytics para mejorar la experiencia 
              del usuario y entender cómo se utiliza nuestro sitio. Las cookies utilizadas son:
            </p>
            <ul className={styles.list}>
              <li><strong>Cookies de Google Analytics:</strong> Utilizadas para recopilar información anónima sobre el uso del sitio web</li>
              <li><strong>localStorage:</strong> Utilizado exclusivamente para guardar sus datos académicos localmente en su dispositivo (no es una cookie tradicional)</li>
            </ul>
            <p className={styles.paragraph}>
              Puede desactivar las cookies de Google Analytics instalando el complemento de inhabilitación para 
              navegadores de Google Analytics disponible en: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className={styles.link}>https://tools.google.com/dlpage/gaoptout</a>
            </p>
            <p className={styles.paragraph}>
              También puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se 
              envía una cookie. Sin embargo, si no acepta las cookies de Analytics, esto no afectará la 
              funcionalidad principal de la aplicación.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Servicios de Terceros</h2>
            <p className={styles.paragraph}>
              NotaMinima utiliza servicios de terceros para mejorar la funcionalidad del sitio:
            </p>
            <ul className={styles.list}>
              <li><strong>Google Analytics:</strong> Para análisis de uso del sitio web. Consulte la Política de Privacidad de Google en: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>https://policies.google.com/privacy</a></li>
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
              Nuestro servicio está diseñado para estudiantes de todas las edades. Dado que no recopilamos 
              información personal de ningún tipo, no recopilamos conscientemente información personal identificable 
              de menores de 18 años.
            </p>
            <p className={styles.paragraph}>
              Si usted es padre o tutor y sabe que su hijo nos ha proporcionado datos personales (lo cual no 
              debería ser posible en el funcionamiento normal de nuestro servicio), contáctenos para que podamos 
              investigar el asunto.
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
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Sus Derechos de Privacidad</h2>
            <p className={styles.paragraph}>
              Usted tiene control completo sobre sus datos:
            </p>
            <ul className={styles.list}>
              <li><strong>Acceso:</strong> Todos sus datos académicos son accesibles en cualquier momento a través de la interfaz de la aplicación</li>
              <li><strong>Exportación:</strong> Puede exportar todos sus datos en formato JSON en cualquier momento</li>
              <li><strong>Eliminación:</strong> Puede eliminar sus datos académicos en cualquier momento limpiando el localStorage del navegador o eliminando cursos individuales</li>
              <li><strong>Portabilidad:</strong> Puede transferir sus datos exportados a otro dispositivo o navegador</li>
              <li><strong>Opt-out de Analytics:</strong> Puede optar por no participar en Google Analytics instalando el complemento de inhabilitación mencionado anteriormente</li>
              <li><strong>Gestión de Cookies:</strong> Puede controlar y eliminar cookies a través de la configuración de su navegador</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Cambios a Esta Política de Privacidad</h2>
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
            <h2 className={styles.sectionTitle}>12. Cumplimiento Legal</h2>
            <p className={styles.paragraph}>
              NotaMinima cumple con las leyes de privacidad aplicables en Chile, incluyendo la Ley N° 19.628 
              sobre Protección de la Vida Privada. El uso de Google Analytics cumple con las políticas de 
              privacidad y términos de servicio de Google, que están diseñados para cumplir con las regulaciones 
              internacionales de protección de datos.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>13. Contacto</h2>
            <p className={styles.paragraph}>
              Si tiene alguna pregunta o inquietud sobre esta Política de Privacidad, puede contactarnos a través 
              de nuestra página web en <a href="https://pokkz.dev" target="_blank" rel="noopener noreferrer" className={styles.link}>pokkz.dev</a>.
            </p>
          </section>

          <div className={styles.highlight}>
            <h3 className={styles.highlightTitle}>En Resumen</h3>
            <p className={styles.highlightText}>
              NotaMinima utiliza Google Analytics para recopilar información anónima sobre el uso del sitio, 
              pero NO recopila ni almacena información personal identificable directamente. Todos sus datos 
              académicos (cursos, notas, cálculos) permanecen en su dispositivo de forma local y usted tiene 
              control total sobre ellos. Puede optar por no participar en Google Analytics en cualquier momento.
            </p>
          </div>
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

