import { Metadata } from 'next';
import { ProductEdit } from './ProductEdit';
import { NO_INDEX_PAGE } from '@/meta/constants';

export const metadata: Metadata = {
  title: 'Edit Product',
  ...NO_INDEX_PAGE,
};
export default function EditProductPage() {
  return <ProductEdit />;
}
