import { Metadata } from 'next';
import { Colors } from './Colors';
import { NO_INDEX_PAGE } from '@/meta/constants';

export const metadata: Metadata = {
  title: 'Colors',
  ...NO_INDEX_PAGE,
};

export default function ColorsPage() {
  return <Colors />;
}
