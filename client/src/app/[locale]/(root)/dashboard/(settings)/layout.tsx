import { DashboardLayout } from '@/components/layouts/dashboardLayout/DashboardLayout';
import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
