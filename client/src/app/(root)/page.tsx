import { Metadata } from 'next';
import Home from './home';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { brandService } from '@/services/brandService';
import { GetBrandDto, GetCategoryDto } from '@/generated/orval/types';
import { SITE_NAME } from '@/utils/constants';
import { generateMeta, POPULAR_KEYWORDS } from '@/components/meta/Meta';
import { cache } from 'react';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const products = await getProducts();
    const topBrands = Array.from(
      new Set(
        products
          ?.map((p) => p.brand?.name)
          .filter((x): x is string => Boolean(x))
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

    return meta;
  } catch (error) {
    // ✅ Если ошибка при build'е - возвращаем default metadata
    console.error('Error generating metadata:', error);
    return {
      title: `${SITE_NAME} | Explore popular products, categories & brands`,
      description: `Welcome to ${SITE_NAME}`,
    };
  }
}

export const getProducts = cache(async () => {
  try {
    const products =
      (await productService.getMostPopular({ limit: 20, skip: 0 })) || [];
    return products;
  } catch (error) {
    // ✅ Если ошибка - возвращаем пустой массив на build time
    console.error('Error fetching products:', error);
    return [];
  }
});

async function getCategories() {
  try {
    const categories = (
      (await categoryService.getAll({
        limit: 8,
        skip: 0,
        sort: { field: 'rating', order: 'desc' },
      })) || []
    )?.categories;
    return categories as GetCategoryDto[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getBrands() {
  try {
    const brands = (
      (await brandService.getAll({
        limit: 8,
        skip: 0,
        sort: { field: 'rating', order: 'desc' },
      })) || []
    ).brands;
    return brands as GetBrandDto[];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function HomePage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);
  return (
    <>
      <Home products={products} categories={categories} brands={brands} />
    </>
  );
}
