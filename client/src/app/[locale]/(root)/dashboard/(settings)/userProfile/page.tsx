import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { UserProfile } from './UserProfile';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('user_profile'),
    ...NO_INDEX_PAGE,
  };
}

export default async function UserProfilePage() {
  return <UserProfile />;
}
