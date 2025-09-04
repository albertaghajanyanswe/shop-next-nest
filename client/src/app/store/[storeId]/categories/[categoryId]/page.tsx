import { Metadata } from 'next';
import { CategoryEdit } from './CategoryEdit';
import { NO_INDEX_PAGE } from '@/meta/constants';

export const metadata: Metadata = {
  title: 'Edit Category',
  ...NO_INDEX_PAGE,
};
export default function EditCategoryPage() {
  return <CategoryEdit />;
}
