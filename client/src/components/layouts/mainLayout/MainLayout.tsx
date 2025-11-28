import { PropsWithChildren } from 'react';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';

export function MainLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
