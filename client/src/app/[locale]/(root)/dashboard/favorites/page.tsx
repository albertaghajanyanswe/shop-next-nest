import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import Favorites from './Favorites';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('favorites'),
    ...NO_INDEX_PAGE,
  };
}

export default async function FavoritesPage() {
  return (
    <>
      <Favorites />;
    </>
  );
}
