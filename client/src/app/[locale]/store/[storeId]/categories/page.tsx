import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Categories } from './Categories';
import { NO_INDEX_PAGE } from '@/utils/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('categories'),
    ...NO_INDEX_PAGE,
  };
}

export default function CategoriesPage() {
  return <Categories />;
}
