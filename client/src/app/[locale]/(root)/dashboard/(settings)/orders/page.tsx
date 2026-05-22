import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import PurchasedOrders from './PurchasedOrders';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('purchased_orders'),
    description:
      'View all your purchases on the platform, including order details, products, quantities, and status.',
    ...NO_INDEX_PAGE,
  };
}

export default async function OrdersPage() {
  return <PurchasedOrders />;
}
