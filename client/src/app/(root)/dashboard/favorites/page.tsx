import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/meta/constants';
import Favorites from './Favorites';

export const metadata: Metadata = {
  title: 'Favorites',
  ...NO_INDEX_PAGE,
};

export default async function FavoritesPage() {
  return <Favorites />;
}
