import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import Subscriptions from './Subscriptions';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('subscriptions'),
    ...NO_INDEX_PAGE,
  };
}

export default async function SubscriptionsPage() {
  return <Subscriptions />;
}
