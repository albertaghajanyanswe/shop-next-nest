import { StoreLayout } from '@/components/layouts/storeLayout/StoreLayout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return <StoreLayout>{children}</StoreLayout>;
}
