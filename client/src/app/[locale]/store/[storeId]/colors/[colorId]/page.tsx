import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ColorEdit } from './ColorEdit';
import { NO_INDEX_PAGE } from '@/utils/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('edit_color'),
    ...NO_INDEX_PAGE,
  };
}
export default function EditColorPage() {
  return <ColorEdit />;
}
