import { Metadata } from 'next';
import { Products } from './Products';
import { NO_INDEX_PAGE } from '@/meta/constants';

export const metadata: Metadata = {
  title: 'Products',
  ...NO_INDEX_PAGE,
};

export default function ProductsPage() {
  return <Products />;
}
