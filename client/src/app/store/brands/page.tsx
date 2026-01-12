import { NO_INDEX_PAGE } from '@/utils/constants';
import { Metadata } from 'next';
import { Brands } from '../[storeId]/brands/Brands';

export const metadata: Metadata = {
  title: 'Brands',
  ...NO_INDEX_PAGE,
};

export default function BrandsPage() {
  return <Brands />;
}
