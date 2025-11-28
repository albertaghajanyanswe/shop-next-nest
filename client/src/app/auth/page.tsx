import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '../../utils/constants';
import Auth from './Auth';

export const metadata: Metadata = {
  title: 'Auth page',
  ...NO_INDEX_PAGE,
};

export default function AuthPage() {
  return <Auth />;
}
