'use client';

import { useState } from 'react';
import { Logo } from '../../mainLayout/header/logo/Logo';
import { Navigation } from './navigation/Navigation';
import { LogOut, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/auth/auth.service';
import { useRouter } from 'next/navigation';
import { PUBLIC_URL } from '@/config/url.config';
import { cn } from '@/utils/common';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, onCollapsedChange }: SidebarProps) {
  const t = useTranslations('SidebarUI');
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const router = useRouter();

  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed;
  const setCollapsed = (val: boolean) => {
    setInternalCollapsed(val);
    onCollapsedChange?.(val);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      router.push(PUBLIC_URL.auth());
    }
  };

  return (
    <div
      className={cn(
        'bg-shop-light-bg relative flex h-full flex-col border-r transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-full lg:w-64'
      )}
    >
      <div
        className={cn(
          'flex h-[70px] shrink-0 items-center border-b px-4',
          collapsed ? 'justify-center' : 'justify-start gap-x-2'
        )}
      >
        {collapsed ? (
          <div className='bg-shop-primary flex size-9 items-center justify-center rounded-lg'>
            <span className='text-sm font-black text-white'>{t('s_logo')}</span>
          </div>
        ) : (
          <Logo />
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? t('expand_sidebar') : t('collapse_sidebar')}
        className='bg-primary-600 hover:bg-primary-700 absolute top-14 -right-3 z-60 flex size-6 cursor-pointer items-center justify-center rounded-full border text-white shadow-sm transition-all duration-200'
      >
        <ArrowLeft
          className={cn(
            'size-3.5 transition-transform duration-300',
            collapsed && 'rotate-180'
          )}
        />
      </button>

      <div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-3 py-4'>
        <Navigation collapsed={collapsed} />
      </div>

      <div className='shrink-0 border-t px-3 py-3'>
        <button
          onClick={handleLogout}
          title={t('logout')}
          className={cn(
            'text-shop-muted-text-7 hover:bg-shop-primary/10 hover:text-shop-primary flex w-full cursor-pointer items-center rounded-lg bg-transparent px-3 py-2.5 text-sm font-medium transition-all duration-200',
            collapsed ? 'justify-center' : 'gap-x-3'
          )}
        >
          <LogOut className='size-5 shrink-0' />
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  );
}
