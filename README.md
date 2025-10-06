# Nota Mínima

Portal web diseñado para estudiantes chilenos que facilita el cálculo de promedios de notas y la conversión de puntajes a notas según el sistema de evaluación chileno.

## Descripción del Proyecto

**Nota Mínima** es una aplicación web moderna y minimalista que proporciona herramientas esenciales para la gestión académica de estudiantes. La aplicación permite:

- **Calcular Promedio de Notas**: Gestiona múltiples cursos, agrega notas con ponderaciones personalizadas y calcula automáticamente promedios ponderados.
- **Convertir Puntaje a Nota**: Transforma puntajes brutos de evaluaciones a notas según el sistema chileno, considerando el porcentaje de exigencia.
- **Almacenamiento Local**: Todos los datos se guardan automáticamente en el navegador del usuario.
- **Exportar/Importar**: Permite respaldar y restaurar datos mediante archivos JSON.

## Características Principales

### Calculadora de Promedio

- Gestión de múltiples cursos simultáneos
- Agregar, editar y eliminar notas
- Sistema de ponderación flexible (0-100%)
- Cálculo automático de promedios ponderados
- Validación automática de rangos de notas (1.0 - 7.0)
- Visualización del estado de cada curso (Aprobado, Reprobado, En Progreso)
- Indicadores de ponderación total con alertas
- Exportación de datos en formato JSON
- Importación de datos con validación de estructura
- Almacenamiento automático en localStorage

### Conversor Puntaje a Nota

- Conversión precisa según el sistema chileno
- Ajuste de porcentaje de exigencia (configurable)
- Soporte para puntajes decimales
- Cálculo automático del porcentaje obtenido
- Indicador visual de estado (Aprobado/Reprobado)
- Validación en tiempo real de valores ingresados

## Stack Tecnológico

- **Framework**: Next.js 15.5.4
- **Biblioteca UI**: React 19.1.0
- **Estilos**: CSS Modules
- **Iconos**: FontAwesome 6.7.2
- **Linter**: ESLint 9
- **Build Tool**: Turbopack

## Requisitos del Sistema

- Node.js 18.x o superior
- npm o cualquier gestor de paquetes compatible

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd notaminima
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir el navegador en `http://localhost:3000`

## Scripts Disponibles

```bash
# Iniciar servidor de desarrollo con Turbopack
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linter
npm run lint
```

## Estructura del Proyecto

```
notaminima/
├── public/              # Archivos estáticos
│   ├── logo.png
│   ├── logo-256.png
│   ├── manifest.json
│   ├── robots.txt
│   ├── sitemap.xml
│   └── ads.txt
├── src/
│   └── app/
│       ├── components/  # Componentes reutilizables
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   └── *.module.css
│       ├── promedio/    # Página calculadora de promedio
│       ├── puntaje-a-nota/ # Página conversión puntaje
│       ├── privacidad/  # Página política de privacidad
│       ├── terminos/    # Página términos y condiciones
│       ├── layout.js    # Layout principal
│       ├── page.js      # Página de inicio
│       └── globals.css  # Estilos globales
├── package.json
├── next.config.mjs
└── eslint.config.mjs
```

## Guías de Diseño

El proyecto sigue principios de diseño específicos:

- **Simplicidad**: Interfaz limpia sin elementos innecesarios
- **Profesionalismo**: Diseño serio y confiable
- **Modernidad**: Uso de estándares y tecnologías actuales
- **Responsividad**: Adaptable a todos los dispositivos
- **Accesibilidad**: Controles intuitivos y navegación clara
- **Sin efectos invasivos**: No se utilizan efectos hover de translateY ni emojis

## Fórmula de Conversión Puntaje a Nota

El sistema utiliza la fórmula estándar chilena:

- Si el puntaje obtenido ≥ puntaje mínimo (exigencia):
  ```
  Nota = 4.0 + 3.0 × ((puntaje_obtenido - puntaje_mínimo) / (puntaje_total - puntaje_mínimo))
  ```

- Si el puntaje obtenido < puntaje mínimo:
  ```
  Nota = 1.0 + 3.0 × (puntaje_obtenido / puntaje_mínimo)
  ```

Donde:
- `puntaje_mínimo = puntaje_total × (exigencia / 100)`
- El resultado se limita entre 1.0 y 7.0

## Privacidad y Seguridad

- Todos los datos se almacenan localmente en el navegador del usuario
- No se envía información a servidores externos
- No se recopilan datos personales
- El usuario tiene control total sobre sus datos mediante las funciones de exportación/importación

## Formato de Exportación

Los datos exportados siguen esta estructura JSON:

```json
{
  "version": "1.0",
  "fecha": "2025-01-15T10:30:00.000Z",
  "cursos": [
    {
      "id": 1234567890,
      "nombre": "Matemáticas",
      "notas": [
        {
          "id": 1234567891,
          "valor": "6.5",
          "ponderacion": "30"
        }
      ]
    }
  ]
}
```

## Contribución

Este es un proyecto en desarrollo activo. Las contribuciones son bienvenidas siguiendo estas pautas:

1. Fork el repositorio
2. Crear una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de tus cambios siguiendo los estándares del proyecto
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

Este proyecto es privado y de uso personal.

## Soporte

Para reportar problemas o sugerir mejoras, por favor utiliza el sistema de issues del repositorio.

---

Desarrollado con Next.js y React para estudiantes chilenos.

