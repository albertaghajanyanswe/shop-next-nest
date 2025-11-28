import { Metadata } from 'next';
import Home from './home';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { brandService } from '@/services/brandService';
import { GetBrandDto, GetCategoryDto } from '@/generated/orval/types';

export const metadata: Metadata = {
  title:
    'Your perfect choice starts here. Explore premium products for every day.',
};

export const revalidate = 60;

async function getProducts() {
  const products =
    (await productService.getMostPopular({ limit: 8, skip: 0 })) || [];
  return products;
}

async function getCategories() {
  const categories = (
    (await categoryService.getAll({ limit: 9, skip: 0 })) || []
  )?.categories;
  return categories as GetCategoryDto[];
}

async function getBrands() {
  const brands = ((await brandService.getAll({ limit: 9, skip: 0 })) || []).brands;
  return brands as GetBrandDto[];
}
export default async function HomePage() {
  const products = await getProducts();
  console.log('products ', products.length);
  const categories = await getCategories();
  const brands = await getBrands();
  return <Home products={products} categories={categories} brands={brands} />;
}
