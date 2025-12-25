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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>;
}): Promise<Metadata> {
  const { storeId } = await params;

  // TODO
  const productsData = await productService.getByStoreIdPublic(storeId, {
    limit: 10,
    skip: 0,
  });

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
    title: `${SITE_NAME} | Shop`,
    description,
    image: COlLAGE_IMG,
    isPublic: true,
    keywords: [...POPULAR_KEYWORDS, ...topCategories, ...topBrands],
    author: SITE_NAME,
    ogType: 'website',
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${PUBLIC_URL.storeShop(storeId)}`,
  });

  console.log('META = ', meta);
  return meta;
}

export const revalidate = 60;

async function getProducts(storeId: string) {
  // TODO
  const products = await productService.getByStoreIdPublic(storeId);
  return products;
}

async function getStore(storeId: string) {
  // TODO
  const store = await storeService.getByIdPublic(storeId);
  return store;
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const productsData = await getProducts(storeId);
  const store = await getStore(storeId);
  const [categoriesData, brandsData] = await Promise.all([
    categoryService.getAll(),
    brandService.getAll(),
  ]);
  return (
    <div className='global-container'>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Shop' }]}
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
