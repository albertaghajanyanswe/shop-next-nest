import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
  },
};

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='global-container my-6'>{children}</main>;
}
