import { getTranslations } from 'next-intl/server';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { Metadata } from 'next';
import { Brands } from '../[storeId]/brands/Brands';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('store_brands'),
    ...NO_INDEX_PAGE,
  };
}

export default function BrandsPage() {
  return <Brands />;
}
