import { Metadata } from 'next';
import { productService } from '@/services/product.service';
import Explorer from './Explorer';
import { EnvVariables } from '@/shared/envVariables';

export const metadata: Metadata = {
  title: 'Product catalog',
};

export const revalidate = 60;

async function getProducts() {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }
  const products = await productService.getAll();
  return products;
}

export default async function ExplorerPage() {
  const products = await getProducts();
  return <Explorer products={products} />;
}
