import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import SoldOrders from './SoldOrders';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('sold_items'),
    description:
      'Track all your sales, view customer information, order status, and totals',
    ...NO_INDEX_PAGE,
  };
}

export default async function OrdersPage() {
  return <SoldOrders />;
}
