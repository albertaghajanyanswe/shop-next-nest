import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { CreateCategory } from './CreateCategory';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('create_category'),
    ...NO_INDEX_PAGE,
  };
}

export default function CreateCategoryPage() {
  return <CreateCategory />;
}
