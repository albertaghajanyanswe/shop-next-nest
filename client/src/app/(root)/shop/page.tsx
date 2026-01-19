import { Metadata } from 'next';
import { cache } from 'react';

import Shop from './Shop';
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';

import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { brandService } from '@/services/brandService';
import { storeService } from '@/services/store.service';

import {
  COlLAGE_IMG,
  generateMeta,
  POPULAR_KEYWORDS,
} from '@/components/meta/Meta';

import { SITE_NAME } from '@/utils/constants';
import { PUBLIC_URL } from '@/config/url.config';

export const revalidate = 60;

/**
 * Caching fetch products for metadata and page
 */
const getProductsCached = cache(
  async (params?: { limit?: number; skip?: number }) => {
    return productService.getAll(params);
  }
);

/**
 * Metadata
 */
export async function generateMetadata(): Promise<Metadata> {
  const productsData = await getProductsCached({ limit: 10, skip: 0 });

  const products = productsData?.products ?? [];

  const topBrands = Array.from(
    new Set(
      products.map((p) => p.brand?.name).filter((x): x is string => Boolean(x))
    )
  ).slice(0, 5);

  const topCategories = Array.from(
    new Set(
      products
        .map((p) => p.category?.name)
        .filter((x): x is string => Boolean(x))
    )
  ).slice(0, 5);

  const categoryList = topCategories.join(', ');

  const description = `Explore all products at ${SITE_NAME} — ${
    categoryList || 'top categories'
  } and more from top brands. Shop the latest deals today.`;

  return generateMeta({
    title: `${SITE_NAME} | Shop`,
    description,
    image: COlLAGE_IMG,
    isPublic: true,
    keywords: [...POPULAR_KEYWORDS, ...topCategories, ...topBrands],
    author: SITE_NAME,
    ogType: 'website',
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${PUBLIC_URL.shop()}`,
  });
}

/**
 * Page
 */
export default async function ShopPage() {
  const [productsData, categoriesData, brandsData, storesData] =
    await Promise.all([
      getProductsCached(),
      categoryService.getAll(),
      brandService.getAll(),
      storeService.getAll(),
    ]);

  return (
    <div className='global-container'>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Shop' }]}
        classNames='mt-6'
      />

      <Shop
        initialProducts={productsData?.products}
        categories={categoriesData?.categories}
        brands={brandsData?.brands}
        stores={storesData?.stores}
        totalCount={productsData?.totalCount}
      />
    </div>
  );
}
