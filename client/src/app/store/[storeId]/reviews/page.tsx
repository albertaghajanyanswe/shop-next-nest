import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/meta/constants';
import { Reviews } from './Reviews';

export const metadata: Metadata = {
  title: 'Reviews',
  ...NO_INDEX_PAGE,
};

export default function ReviewsPage() {
  return <Reviews />;
}
