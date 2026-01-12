import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { Categories } from '../[storeId]/categories/Categories';

export const metadata: Metadata = {
  title: 'Categories',
  ...NO_INDEX_PAGE,
};

export default function CategoriesPage() {
  return <Categories />;
}
