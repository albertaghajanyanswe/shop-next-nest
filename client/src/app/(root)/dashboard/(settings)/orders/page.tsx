import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import Orders from './Orders';

export const metadata: Metadata = {
  title: 'My Orders',
  ...NO_INDEX_PAGE,
};

export default async function OrdersPage() {
  return <Orders />;
}
