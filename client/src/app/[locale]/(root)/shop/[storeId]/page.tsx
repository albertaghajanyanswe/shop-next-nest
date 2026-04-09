import { Metadata } from 'next';
import Shop from '../Shop';
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
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import { PUBLIC_URL } from '@/config/url.config';
import { cache } from 'react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>;
}): Promise<Metadata> {
  const { storeId } = await params;
  const productsData = await getProducts(storeId, { limit: 10, skip: 0 });

  const topBrands = Array.from(
    new Set(
      productsData?.products
        ?.map((p) => p.brand?.name)
        .filter((x): x is string => Boolean(x))
    )
  ).slice(0, 5);

  const topCategories = Array.from(
    new Set(
      productsData?.products
        ?.map((p) => p.category?.name)
        .filter((x): x is string => Boolean(x))
    )
  ).slice(0, 5);
  const categoryList = topCategories.join(', ');

  const description = `Explore all products at ${SITE_NAME} — ${categoryList} and more from top brands. Shop the latest deals today.`;

  const meta = generateMeta({
    title: `${productsData?.products?.[0]?.store?.title || SITE_NAME} | Shop`,
    description,
    image: COlLAGE_IMG,
    isPublic: true,
    keywords: [...POPULAR_KEYWORDS, ...topCategories, ...topBrands],
    author: SITE_NAME,
    ogType: 'website',
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${PUBLIC_URL.storeShop(storeId)}`,
  });

  return meta;
}

export const revalidate = 60;

const getProducts = cache(
  async (storeId: string, params?: { limit?: number; skip?: number }) => {
    //TODO
    const products = await productService.getByStoreIdPublic(storeId, params);
    return products;
  }
);

async function getStore(storeId: string) {
  // TODO
  const store = await storeService.getById(storeId);
  return store;
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const [store, productsData, categoriesData, brandsData] = await Promise.all([
    getStore(storeId),
    getProducts(storeId),
    categoryService.getAll(),
    brandService.getAll(),
  ]);
  return (
    <div className='global-container'>
      <Breadcrumbs
        items={[
          { title: 'Home', href: '/' },
          { title: 'Shop', href: PUBLIC_URL.shop() },
          { title: store?.title || 'Store' },
        ]}
        classNames='mt-4'
      />

      <Shop
        initialProducts={productsData?.products}
        categories={categoriesData?.categories}
        brands={brandsData?.brands}
        totalCount={productsData?.totalCount}
        store={store}
      />
    </div>
  );
}
