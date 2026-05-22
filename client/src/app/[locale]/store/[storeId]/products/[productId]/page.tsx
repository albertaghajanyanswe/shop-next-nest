import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ProductEdit } from './ProductEdit';
import { NO_INDEX_PAGE } from '@/utils/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('edit_product'),
    ...NO_INDEX_PAGE,
  };
}
export default function EditProductPage() {
  return <ProductEdit />;
}
