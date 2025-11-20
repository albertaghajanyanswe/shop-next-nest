import { NO_INDEX_PAGE } from '@/utils/constants';
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout/DashboardLayout';

export const metadata: Metadata = {
  title: 'Dashboard',
  ...NO_INDEX_PAGE,
};

export default function DashboardPage() {
  return (
    <>
      <DashboardLayout />
    </>
  );
}
