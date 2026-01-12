import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { CategoryEdit } from '../../[storeId]/categories/[categoryId]/CategoryEdit';

export const metadata: Metadata = {
  title: 'Edit Category',
  ...NO_INDEX_PAGE,
};
export default function EditCategoryPage() {
  return <CategoryEdit />;
}
