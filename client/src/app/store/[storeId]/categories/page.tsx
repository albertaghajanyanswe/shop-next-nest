import { Metadata } from 'next';
import { Categories } from './Categories';
import { NO_INDEX_PAGE } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Categories',
  ...NO_INDEX_PAGE,
};

export default function CategoriesPage() {
  return <Categories />;
}
