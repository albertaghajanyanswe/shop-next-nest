import { getTranslations } from 'next-intl/server';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { Metadata } from 'next';
import { Settings } from './Settings';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('store_settings'),
    ...NO_INDEX_PAGE,
  };
}

export default function SettingsPage() {
  return <Settings />;
}
