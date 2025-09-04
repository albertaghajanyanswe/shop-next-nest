import { Metadata } from 'next';
import { productService } from '@/services/product.service';
import Explorer from './Explorer';

export const metadata: Metadata = {
  title: 'Product catalog',
};

export const revalidate = 60;

async function getProducts() {
  const products = await productService.getAll();
  return products;
}

export default async function ExplorerPage() {
  const products = await getProducts();
  return <Explorer products={products} />;
}
