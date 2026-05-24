import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:8080';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/dashboard/',
          '/forgot-password/',
          '/reset-password/',
          '/store/*/settings/',
          '/store/*/products/create/',
          '/store/*/products/*/edit/',
          '/store/*/brands/create/',
          '/store/*/categories/create/',
          '/store/*/colors/create/',
          '/payment/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
