import type { MetadataRoute } from 'next';

const LOCALES = ['ru', 'en'] as const;
const BASE_URL = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:8080';

interface ApiProduct {
  id: string;
  title: string;
  updatedAt: string;
}

interface ApiStore {
  id: string;
  name: string;
  updatedAt: string;
}

interface ApiCategory {
  id: string;
  name: string;
}

interface ApiBrand {
  id: string;
  name: string;
}

const STATIC_ROUTES = [
  '',
  '/auth',
  '/forgot-password',
  '/reset-password',
  '/aboutUs',
  '/contactUs',
  '/faqs',
  '/howItWorks',
  '/privacyPolicy',
  '/termsAndService',
  '/shop',
  '/stores',
  '/store/categories',
  '/store/brands',
  '/billing',
  '/thanks',
];

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getDynamicRoutes() {
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_SERVICE ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://server:4000';

  const [productsRes, storesRes, categoriesRes, brandsRes] = await Promise.all([
    fetchJson<{ products: ApiProduct[] }>(
      `${serverUrl}/api/products?limit=1000&skip=0`
    ),
    fetchJson<{ stores: ApiStore[] }>(
      `${serverUrl}/api/store?limit=1000&skip=0`
    ),
    fetchJson<{ categories: ApiCategory[] }>(
      `${serverUrl}/api/categories?limit=1000&skip=0`
    ),
    fetchJson<{ brands: ApiBrand[] }>(
      `${serverUrl}/api/brands?limit=1000&skip=0`
    ),
  ]);

  return {
    products: productsRes?.products ?? [],
    stores: storesRes?.stores ?? [],
    categories: categoriesRes?.categories ?? [],
    brands: brandsRes?.brands ?? [],
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamic = await getDynamicRoutes();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const localePrefix = `/${locale}`;

    for (const route of STATIC_ROUTES) {
      const url = `${BASE_URL}${localePrefix}${route}`;
      const alternates: Record<string, string> = {};

      for (const altLocale of LOCALES) {
        alternates[altLocale] = `${BASE_URL}/${altLocale}${route}`;
      }

      entries.push({
        url,
        alternates: { languages: alternates },
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        lastModified: new Date(),
      });
    }

    for (const product of dynamic.products) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/product/${product.id}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    for (const store of dynamic.stores) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/shop/${store.id}`,
        lastModified: new Date(store.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      });

      entries.push({
        url: `${BASE_URL}${localePrefix}/store/${store.id}`,
        lastModified: new Date(store.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    for (const category of dynamic.categories) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/store/categories/${category.id}`,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }

    for (const brand of dynamic.brands) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/store/brands/${brand.id}`,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
