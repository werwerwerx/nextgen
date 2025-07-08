import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/courses',
        '/courses/*',
      ],
      disallow: [
        '/admin',
        '/admin/*',
        '/api/*',
        '/_next/*',
        '/static/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 