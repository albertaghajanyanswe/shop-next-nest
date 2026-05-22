import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { CategoryEdit } from './CategoryEdit';
import { NO_INDEX_PAGE } from '@/utils/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('edit_category'),
    ...NO_INDEX_PAGE,
  };
}
export default function EditCategoryPage() {
  return <CategoryEdit />;
}
