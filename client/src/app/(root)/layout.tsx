import { ChatFloatingButton } from '@/components/chat';
import { MainLayout } from '@/components/layouts/mainLayout/MainLayout';
import { getAccessToken } from '@/services/auth/auth-token.service';
import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <MainLayout>
      {children}
      <ChatFloatingButton title='AI Assistant' />
    </MainLayout>
  );
}
