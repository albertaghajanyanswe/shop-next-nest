import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Auth from './Auth';
import { NO_INDEX_PAGE } from '@/utils/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('auth_page'),
    ...NO_INDEX_PAGE,
  };
}

export default function AuthPage() {
  return <Auth />;
}
