'use client';

import { saveTokenStorage } from '@/services/auth/auth-token.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import {
  CreditCard,
  HelpCircle,
  LogOut,
  ArrowUpCircle,
  Menu,
  CircleDollarSign,
  Settings,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { cn } from '@/utils/common';
import { Card } from '@/components/ui/Card';
import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config';
import { MenuItem } from '../storeLayout/sidebar/navigation/MenuItem';
import { useLogout } from '@/hooks/queries/user/useLogout';
import { GetUserDto } from '@/generated/orval/types';
import Image from 'next/image';
import { generateImgPath } from '@/utils/imageUtils';
import { EnvVariables } from '@/shared/envVariables';

const menuItems = (user: GetUserDto) => {
  return [
    {
      value: 'Manage Orders',
      icon: CircleDollarSign,
      link: DASHBOARD_URL.manageOrders(),
      show: user.role === 'SUPER_ADMIN',
    },
    {
      value: 'My Orders',
      icon: ShoppingBag,
      link: DASHBOARD_URL.orders(),
      show: true,
    },
    {
      value: 'My sales',
      icon: CircleDollarSign,
      link: DASHBOARD_URL.sales(),
      show: true,
    },
    {
      value: 'Subscriptions',
      icon: CreditCard,
      link: DASHBOARD_URL.subscriptions(),
      show: true,
    },
    {
      value: 'Support service',
      icon: HelpCircle,
      link: PUBLIC_URL.contactUs(),
      show: true,
    },
    {
      value: 'Account Settings',
      icon: Settings,
      link: DASHBOARD_URL.settings(),
      show: EnvVariables.NEXT_PUBLIC_ALLOW_PURCHASE,
    },
    {
      value: 'User profile',
      icon: UserRound,
      link: DASHBOARD_URL.userProfile(),
      show: true,
    },
  ];
};

export function DashboardLayout({ children }: PropsWithChildren<unknown>) {
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { logout } = useLogout();

  const handleLayout = () => {
    logout();
  };

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    if (accessToken) {
      saveTokenStorage(accessToken);
    }
  }, [searchParams]);

  const { user } = useProfile();

  if (!user) return null;

  return (
    <div className='w-full'>
      {/* Mobile/Tablet Horizontal Navigation (below lg) */}
      <div className='bg-shop-light-bg h-full py-4 lg:hidden'>
        <div className='global-container flex flex-col gap-4'>
          {/* User Card */}
          <Card className='flex items-center gap-3 bg-shop-white p-3 shadow-none'>
            <Image
              src={
                generateImgPath(user?.picture || '') ||
                '/images/no-user-image.png'
              }
              alt={user?.name || 'User img'}
              width={42}
              height={42}
              className='w-10 rounded-full'
              priority={false}
            />
            <div className='flex flex-1 flex-col items-center'>
              <span className='font-medium text-neutral-900'>{user.name}</span>
              <span className='text-sm text-neutral-700'>{user.email}</span>
            </div>
          </Card>
          {!collapsed && (
            <div className='mb-4 rounded-md bg-gradient-to-r from-emerald-200 to-lime-200 p-2 text-sm text-neutral-900'>
              <div className='flex items-center gap-2'>
                <ArrowUpCircle className='h-6 min-h-6 w-6 min-w-6 text-purple-600' />
                <span>Upgrade your plan to unlock Premium features</span>
              </div>
            </div>
          )}
          {/* Horizontal Scroll Menu */}
          <div className='overflow-x-auto'>
            <div className='mb-2 flex gap-2'>
              {menuItems(user).map((route) => {
                return (
                  route.show && (
                    <MenuItem
                      key={route.value}
                      route={route}
                      showOnlyIcon={false}
                      className='h-9 rounded-md text-sm whitespace-nowrap'
                    />
                  )
                );
              })}
              <Button
                variant='secondary'
                className='text-xs font-medium whitespace-nowrap'
                onClick={handleLayout}
              >
                <LogOut className='h-5 w-5' />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (lg and above) */}
      <div className='global-container my-6 hidden w-full flex-row gap-6 lg:flex'>
        <div className='layout'>
          <div className='inset-y-0 z-[50] flex h-full flex-col'>
            <aside
              className={cn(
                'flex flex-col rounded-md bg-shop-white shadow-sm transition-all duration-300',
                collapsed ? 'w-20 items-center p-2' : 'w-64 p-2'
              )}
            >
              {/* Header */}
              <div className='flex items-center justify-between'>
                {!collapsed && (
                  <h2 className='text-lg font-semibold'>Profile</h2>
                )}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setCollapsed(!collapsed)}
                  className='rounded-lg'
                >
                  <Menu className='h-5 w-5' />
                </Button>
              </div>

              {/* User card */}
              <Card
                className={cn(
                  'mt-4 flex items-center gap-3 p-3 shadow-none transition-all',
                  collapsed ? 'flex-col p-2' : ''
                )}
              >
                <Image
                  src={
                    generateImgPath(user?.picture || '') ||
                    '/images/no-user-image.png'
                  }
                  alt={user?.name || 'User img'}
                  width={42}
                  height={42}
                  className='w-9 rounded-full sm:w-10'
                  priority={false}
                />
                {!collapsed && (
                  <div className='flex w-full flex-1 flex-col'>
                    <span className='font-medium text-neutral-900'>
                      {user.name}
                    </span>
                    <span className='text-sm text-shop-muted-text-5'>{user.email}</span>
                  </div>
                )}
              </Card>

              {/* Upgrade block */}
              {!collapsed && (
                <div className='mt-3 rounded-md bg-gradient-to-r from-emerald-100 to-lime-200 p-3 text-sm text-neutral-900'>
                  <div className='flex items-center gap-2'>
                    <ArrowUpCircle className='h-8 w-8 text-purple-600' />
                    <span>Upgrade your plan to unlock Premium features</span>
                  </div>
                </div>
              )}

              <div className='my-4 border-t' />
              <div className='flex w-full flex-1 flex-col'>
                <div
                  className={`flex w-full flex-col space-y-1 ${collapsed ? 'items-center' : ''}`}
                >
                  {menuItems(user).map((route) => {
                    return (
                      route.show && (
                        <MenuItem
                          key={route.value}
                          route={route}
                          showOnlyIcon={collapsed}
                          className='h-9 rounded-md text-sm whitespace-nowrap'
                        />
                      )
                    );
                  })}
                </div>
              </div>
              <div className='mt-auto pt-4'>
                <Button
                  variant='secondary'
                  className={cn(
                    'w-full text-sm font-medium',
                    collapsed ? 'justify-center' : ''
                  )}
                  onClick={handleLayout}
                >
                  <LogOut className='h-5 w-5' />
                  {!collapsed && <span>Logout</span>}
                </Button>
              </div>
            </aside>
          </div>
        </div>
        <main className='w-full bg-shop-white'>{children}</main>
      </div>

      {/* Main content for mobile/tablet */}
      <div className='lg:hidden'>
        <main className='global-container my-8 w-full bg-shop-white'>
          {children}
        </main>
      </div>
    </div>
  );
}
