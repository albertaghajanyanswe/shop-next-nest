import { Metadata } from 'next';
import Home from './home';
import { productService } from '@/services/product.service';

export const metadata: Metadata = {
  title: 'Your orders, your notifications - all in one place',
};

export const revalidate = 60;

async function getProducts() {
  const products = (await productService.getMostPopular() || []).slice(0, 6);
  return products;
}

export default async function HomePage() {
  const products = await getProducts();
  return <Home products={products} />;
}
