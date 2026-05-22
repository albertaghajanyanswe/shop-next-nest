import { getTranslations } from 'next-intl/server';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { Metadata } from 'next';
import Store from './Store';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('manage_store'),
    ...NO_INDEX_PAGE,
  };
}

export default function StorePage() {
  return <Store />;
}
