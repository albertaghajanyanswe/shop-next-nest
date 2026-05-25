import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'index, follow',
};

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='global-container my-6'>{children}</main>;
}
