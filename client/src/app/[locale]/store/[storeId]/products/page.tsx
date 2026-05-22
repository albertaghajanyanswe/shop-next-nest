import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Products } from './Products';
import { NO_INDEX_PAGE } from '@/utils/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('products'),
    ...NO_INDEX_PAGE,
  };
}

export default function ProductsPage() {
  return <Products />;
}
