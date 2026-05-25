import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME } from '../../utils/constants';
import { Providers } from '../../providers/providers';
import { Poppins } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const poppins = Poppins({
  subsets: ['latin'],
  style: 'normal',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || '';
  const locales = ['ru', 'en'];

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${baseUrl}/${l}`;
  }

  const ogLocale = locale === 'ru' ? 'ru_RU' : 'en_US';

  return {
    title: {
      absolute: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      type: 'website',
      locale: ogLocale,
      siteName: SITE_NAME,
      images: [
        {
          url: '/images/myStore_logo.svg',
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: ['/images/myStore_logo.svg'],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${poppins.className}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
