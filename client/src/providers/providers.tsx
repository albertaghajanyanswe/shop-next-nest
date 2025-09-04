'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { persistor, store } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

export function Providers({ children }: PropsWithChildren) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster />
          {children}
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
