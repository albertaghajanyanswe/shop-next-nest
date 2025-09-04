import { StoreLayout } from '@/components/layouts/store-layout/StoreLayout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return <StoreLayout>{children}</StoreLayout>;
}
