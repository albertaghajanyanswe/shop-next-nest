import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { UserProfile } from './UserProfile';

export const metadata: Metadata = {
  title: 'User profile',
  ...NO_INDEX_PAGE,
};

export default async function UserProfilePage() {
  return <UserProfile />;
}
