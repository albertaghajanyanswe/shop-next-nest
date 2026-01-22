import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import SoldOrders from './SoldOrders';

export const metadata: Metadata = {
  title: 'Sold items',
  description:
    'Track all your sales, view customer information, order status, and totals',
  ...NO_INDEX_PAGE,
};

export default async function OrdersPage() {
  return <SoldOrders />;
}
