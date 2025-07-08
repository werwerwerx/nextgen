import { MetadataRoute } from 'next';
import { getCources } from '@/features/cource/cource.api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Получаем базовый URL из переменных окружения
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  // Получаем все активные курсы
  const courses = await getCources();

  // Базовые страницы (исключая админские маршруты)
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // Добавляем страницы курсов
  const courseRoutes = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...courseRoutes];
} 