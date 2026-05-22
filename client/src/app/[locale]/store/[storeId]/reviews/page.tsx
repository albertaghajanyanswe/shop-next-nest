import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { Reviews } from './Reviews';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('reviews'),
    ...NO_INDEX_PAGE,
  };
}

export default function ReviewsPage() {
  return <Reviews />;
}
