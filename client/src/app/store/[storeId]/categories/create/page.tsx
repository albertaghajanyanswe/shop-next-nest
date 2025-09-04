import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/meta/constants';
import { CreateCategory } from './CreateCategory';

export const metadata: Metadata = {
  title: 'Create Category',
  ...NO_INDEX_PAGE,
};

export default function CreateCategoryPage() {
  return <CreateCategory />;
}
