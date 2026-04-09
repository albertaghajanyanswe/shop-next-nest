'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ReduxProvider } from './ReduxProvider';
import { Toaster } from 'react-hot-toast';
import { CustomTooltipProvider } from './CustomTooltipProviders';

export function Providers({ children }: PropsWithChildren) {
  return (
    /* Uncomment system theme if activate toggle theme button from AccountSettings file  */
    // <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
    <NextThemesProvider attribute='class' defaultTheme='light' enableSystem>
      <ReactQueryProvider>
        <ReduxProvider>
          <Toaster />
          <CustomTooltipProvider>{children}</CustomTooltipProvider>
        </ReduxProvider>
      </ReactQueryProvider>
    </NextThemesProvider>
  );
}
