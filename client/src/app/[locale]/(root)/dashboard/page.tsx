import { getTranslations } from 'next-intl/server';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboardLayout/DashboardLayout';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Pages');
  return {
    title: t('dashboard'),
    ...NO_INDEX_PAGE,
  };
}

export default function DashboardPage() {
  return (
    <>
      <DashboardLayout />
    </>
  );
}
