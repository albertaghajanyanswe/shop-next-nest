'use client';

import { PropsWithChildren } from 'react';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ReduxProvider } from './ReduxProvider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ReduxProvider>
        <Toaster />
        {children}
      </ReduxProvider>
    </ReactQueryProvider>
  );
}
