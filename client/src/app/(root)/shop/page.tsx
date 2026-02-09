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

// ✅ ISR - перестраивается каждые 60 секунд
export const revalidate = 60;

/**
 * Caching fetch products for metadata and page
 */
const getProductsCached = cache(
  async (params?: { limit?: number; skip?: number }) => {
    try {
      return await productService.getAll(params);
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], totalCount: 0 };
    }
  }
);

/**
 * Get categories with error handling
 */
const getCategoriesCached = cache(async () => {
  try {
    return await categoryService.getAll();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [] };
  }
});

/**
 * Get brands with error handling
 */
const getBrandsCached = cache(async () => {
  try {
    return await brandService.getAll();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return { brands: [] };
  }
});

/**
 * Get stores with error handling
 */
const getStoresCached = cache(async () => {
  try {
    return await storeService.getAll();
  } catch (error) {
    console.error('Error fetching stores:', error);
    return { stores: [] };
  }
});

/**
 * Metadata with error handling
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const productsData = await getProductsCached({ limit: 10, skip: 0 });

    const products = productsData?.products ?? [];

    const topBrands = Array.from(
      new Set(
        products
          .map((p) => p.brand?.name)
          .filter((x): x is string => Boolean(x))
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
  } catch (error) {
    // ✅ Fallback metadata на build time
    console.error('Error generating metadata:', error);
    return {
      title: `${SITE_NAME} | Shop`,
      description: `Explore all products at ${SITE_NAME}`,
      openGraph: {
        title: `${SITE_NAME} | Shop`,
        description: `Explore all products at ${SITE_NAME}`,
        images: [COlLAGE_IMG],
        type: 'website',
      },
    };
  }
}

/**
 * Page with error handling
 */
export default async function ShopPage() {
  const [products, categories, brands, stores] = await Promise.all([
    getProductsCached({ limit: 40, skip: 0 }).catch(() => ({
      products: [],
      totalCount: 0,
    })),
    getCategoriesCached().catch(() => ({ categories: [] })),
    getBrandsCached().catch(() => ({ brands: [] })),
    getStoresCached().catch(() => ({ stores: [] })),
  ]);

  return (
    <div className='global-container'>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Shop' }]}
        classNames='mt-6'
      />

      <Shop
        initialProducts={products?.products}
        categories={categories?.categories}
        brands={brands?.brands}
        stores={stores?.stores}
        totalCount={products?.totalCount}
      />
    </div>
  );
}
