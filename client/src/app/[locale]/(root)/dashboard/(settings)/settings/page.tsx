import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import AccountSettings from './AccountSettings';

export const metadata: Metadata = {
  title: 'Account Settings',
  ...NO_INDEX_PAGE,
};

export default async function AccountSettingsPage() {
  return <AccountSettings />;
}
