import type { Metadata } from 'next';
import './globals.css';
import { SITE_DESCRIPTION, SITE_NAME } from '../utils/constants';
import { Providers } from '../providers/providers';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
