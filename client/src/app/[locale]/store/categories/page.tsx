import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { Categories } from '../[storeId]/categories/Categories';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('store_categories'),
    ...NO_INDEX_PAGE,
  };
}

export default function CategoriesPage() {
  return <Categories />;
}
