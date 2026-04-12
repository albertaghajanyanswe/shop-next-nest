import type { PropsWithChildren } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';

export function StoreLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='flex w-full flex-col'>
      <div className='layout'>
        <div className='fixed inset-y-0 z-[50] hidden h-full w-64 flex-col lg:flex'>
          <Sidebar />
        </div>
        <div className='fixed inset-y-0 z-[49] h-[70px] w-full lg:pl-64'>
          <Header />
        </div>
      </div>
      <main className='bg-shop-white min-h-[100svh] py-[70px] lg:pl-64'>
        {children}
      </main>
    </div>
  );
}
