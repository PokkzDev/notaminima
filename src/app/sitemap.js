export default function sitemap() {
  const baseUrl = "https://notaminima.cl";
  const now = new Date();
  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/promedio`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/puntaje-a-nota`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}



