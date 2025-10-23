import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { CreateProduct } from './CreateProduct';

export const metadata: Metadata = {
  title: 'Create Product',
  ...NO_INDEX_PAGE,
};

export default function CreateProductPage() {
  return <CreateProduct />;
}
