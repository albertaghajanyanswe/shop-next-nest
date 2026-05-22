import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { BrandEdit } from './BrandEdit';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('edit_brand'),
    ...NO_INDEX_PAGE,
  };
}
export default function EditColorPage() {
  return <BrandEdit />;
}
