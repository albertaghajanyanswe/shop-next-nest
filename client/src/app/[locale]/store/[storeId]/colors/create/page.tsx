import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { CreateColor } from './CreateColor';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('create_color'),
    ...NO_INDEX_PAGE,
  };
}

export default function CreateColorPage() {
  return <CreateColor />;
}
