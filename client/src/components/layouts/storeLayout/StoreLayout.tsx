'use client';

import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { cn } from '@/utils/common';

export function StoreLayout({ children }: PropsWithChildren<unknown>) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='flex w-full flex-col'>
      <div className='layout'>
        {/* Desktop sidebar */}
        <div
          className={cn(
            'left-sidebar fixed inset-y-0 z-50 hidden h-full flex-col overflow-visible transition-all duration-300 ease-in-out lg:flex',
            collapsed ? 'w-[72px]' : 'w-64'
          )}
        >
          <Sidebar isCollapsed={collapsed} onCollapsedChange={setCollapsed} />
        </div>
        {/* Header */}
        <div
          className={cn(
            'fixed inset-y-0 z-49 h-[70px] w-full transition-all duration-300 ease-in-out',
            collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
          )}
        >
          <Header />
        </div>
      </div>
      <main
        className={cn(
          'bg-shop-white min-h-svh py-[70px] transition-all duration-300 ease-in-out',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}
