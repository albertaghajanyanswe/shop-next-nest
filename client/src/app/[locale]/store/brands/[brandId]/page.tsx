import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { BrandEdit } from '../../[storeId]/brands/[brandId]/BrandEdit';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('store_edit_brand'),
    ...NO_INDEX_PAGE,
  };
}
export default function EditColorPage() {
  return <BrandEdit />;
}
