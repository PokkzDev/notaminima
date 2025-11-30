export default function sitemap() {
  const baseUrl = 'https://notaminima.cl';
  const currentDate = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        {
          url: `${baseUrl}/logo-256.png`,
          title: 'Nota Mínima - Calculadora de Notas Chile',
          caption: 'Calculadora gratuita de notas para estudiantes chilenos',
        },
      ],
    },
    {
      url: `${baseUrl}/promedio`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [
        {
          url: `${baseUrl}/logo-256.png`,
          title: 'Calculadora de Promedio Ponderado Chile',
          caption: 'Calcula tu promedio ponderado y gestiona múltiples cursos',
        },
      ],
    },
    {
      url: `${baseUrl}/puntaje-a-nota`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
      images: [
        {
          url: `${baseUrl}/logo-256.png`,
          title: 'Conversor Puntaje a Nota Chile',
          caption: 'Convierte puntajes a notas en escala chilena 1.0-7.0',
        },
      ],
    },
    {
      url: `${baseUrl}/acerca`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ayuda`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}

