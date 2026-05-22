import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Colors } from './Colors';
import { NO_INDEX_PAGE } from '@/utils/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('colors'),
    ...NO_INDEX_PAGE,
  };
}

export default function ColorsPage() {
  return <Colors />;
}
