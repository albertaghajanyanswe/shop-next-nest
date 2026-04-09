import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import ManageOrders from './ManageOrders';

export const metadata: Metadata = {
  title: 'My Orders',
  description:
    'View all your purchases on the platform, including order details, products, quantities, and status.',
  ...NO_INDEX_PAGE,
};

export default async function OrdersPage() {
  return <ManageOrders />;
}
