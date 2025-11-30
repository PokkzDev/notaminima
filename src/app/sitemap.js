export default function sitemap() {
  const baseUrl = 'https://notaminima.cl';
  // Use fixed dates for stable sitemap entries
  const lastUpdated = '2025-11-30T00:00:00.000Z';

  return [
    // Main pages - High priority
    {
      url: baseUrl,
      lastModified: lastUpdated,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'es-CL': baseUrl,
          'es': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/promedio`,
      lastModified: lastUpdated,
      changeFrequency: 'weekly',
      priority: 0.95,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/promedio`,
          'es': `${baseUrl}/promedio`,
        },
      },
    },
    {
      url: `${baseUrl}/puntaje-a-nota`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.95,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/puntaje-a-nota`,
          'es': `${baseUrl}/puntaje-a-nota`,
        },
      },
    },
    {
      url: `${baseUrl}/escala-de-notas`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/escala-de-notas`,
          'es': `${baseUrl}/escala-de-notas`,
        },
      },
    },
    // Secondary pages
    {
      url: `${baseUrl}/ayuda`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/ayuda`,
          'es': `${baseUrl}/ayuda`,
        },
      },
    },
    {
      url: `${baseUrl}/acerca`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/acerca`,
          'es': `${baseUrl}/acerca`,
        },
      },
    },
    // Auth pages
    {
      url: `${baseUrl}/login`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/login`,
          'es': `${baseUrl}/login`,
        },
      },
    },
    {
      url: `${baseUrl}/register`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/register`,
          'es': `${baseUrl}/register`,
        },
      },
    },
    // Legal pages
    {
      url: `${baseUrl}/privacidad`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/privacidad`,
          'es': `${baseUrl}/privacidad`,
        },
      },
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: {
        languages: {
          'es-CL': `${baseUrl}/terminos`,
          'es': `${baseUrl}/terminos`,
        },
      },
    },
  ];
}

