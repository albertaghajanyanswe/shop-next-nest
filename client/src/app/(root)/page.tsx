import { Metadata } from 'next';
import Home from './home';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { brandService } from '@/services/brandService';
import { GetBrandDto, GetCategoryDto } from '@/generated/orval/types';
import { SITE_NAME } from '@/utils/constants';
import { generateMeta, POPULAR_KEYWORDS } from '@/components/meta/Meta';

export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts();

  const topBrands = Array.from(
    new Set(
      products?.map((p) => p.brand?.name).filter((x): x is string => Boolean(x))
    )
  ).slice(0, 5);

  const topCategories = Array.from(
    new Set(
      products
        ?.map((p) => p.category?.name)
        .filter((x): x is string => Boolean(x))
    )
  ).slice(0, 5);
  const categoryList = topCategories.join(', ');

  const description = `Explore all products at ${SITE_NAME} — ${categoryList} and more from top brands. Shop the latest deals today.`;
  const meta = generateMeta({
    title: `${SITE_NAME} | Explore popular products, categories & brands`,
    description,
    image: '/images/myStore_logo.svg',
    isPublic: true,
    keywords: [...POPULAR_KEYWORDS, ...topCategories, ...topBrands],
    author: SITE_NAME,
    ogType: 'website',
    url: process.env.NEXT_PUBLIC_CLIENT_URL,
  });

  console.log('META = ', meta);
  return meta;
}

export const revalidate = 60;

async function getProducts() {
  // TODO
  // const isDevOrProd =
  //   process.env.NODE_ENV === 'production' ||
  //   process.env.NODE_ENV === 'development';
  // if (isDevOrProd) {
  //   return [];
  // }

  const products =
    (await productService.getMostPopular({ limit: 8, skip: 0 })) || [];
  return products;
}

async function getCategories() {
  // TODO
  const categories = (
    (await categoryService.getAll({
      limit: 9,
      skip: 0,
      sort: { field: 'rating', order: 'desc' },
    })) || []
  )?.categories;
  return categories as GetCategoryDto[];
}

async function getBrands() {
  // TODO

  const brands = (
    (await brandService.getAll({
      limit: 9,
      skip: 0,
      sort: { field: 'rating', order: 'desc' },
    })) || []
  ).brands;
  return brands as GetBrandDto[];
}
export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();
  const brands = await getBrands();
  return (
    <>
      <Home products={products} categories={categories} brands={brands} />
    </>
  );
}
