import { Metadata } from 'next';
import Auth from './Auth';
import { NO_INDEX_PAGE } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Auth page',
  ...NO_INDEX_PAGE,
};

export default function AuthPage() {
  return <Auth />;
}
