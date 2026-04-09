import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import Subscriptions from './Subscriptions';

export const metadata: Metadata = {
  title: 'Subscriptions',
  ...NO_INDEX_PAGE,
};

export default async function SubscriptionsPage() {
  return <Subscriptions />;
}
