import { PropsWithChildren } from 'react';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';

export function MainLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='mx-5 flex-1 lg:mx-14'>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
