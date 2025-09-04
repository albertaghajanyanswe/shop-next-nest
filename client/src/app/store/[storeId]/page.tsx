import { NO_INDEX_PAGE } from '@/meta/constants';
import { Metadata } from 'next';
import Store from './Store';

export const metadata: Metadata = {
  title: 'Manage store',
  ...NO_INDEX_PAGE,
};

export default function StorePage() {
  return <Store />;
}
