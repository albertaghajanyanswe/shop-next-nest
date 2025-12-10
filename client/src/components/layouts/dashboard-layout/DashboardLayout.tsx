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
} from 'lucide-react';
import { cn } from '@/utils/common';
import { Card } from '@/components/ui/Card';
import { DASHBOARD_URL } from '@/config/url.config';
import { MenuItem } from '../storeLayout/sidebar/navigation/MenuItem';
import { useLogout } from '@/hooks/queries/user/useLogout';
import { GetUserDto } from '@/generated/orval/types';

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
      icon: CircleDollarSign,
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
    { value: 'Support service', icon: HelpCircle, link: '', show: true },
    {
      value: 'Account Settings',
      icon: Settings,
      link: DASHBOARD_URL.settings(),
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
    <div className='global-container my-6 flex w-full flex-row gap-6'>
      <div className='layout'>
        <div className='inset-y-0 z-[50] flex h-full flex-col'>
          <aside
            className={cn(
              'flex flex-col rounded-md bg-white shadow-sm transition-all duration-300',
              collapsed ? 'w-20 items-center p-3' : 'w-80 p-5'
            )}
          >
            {/* Header */}
            <div className='flex items-center justify-between'>
              {!collapsed && <h2 className='text-lg font-semibold'>Profile</h2>}
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
                'mt-4 flex items-center gap-3 p-3 transition-all',
                collapsed ? 'flex-col p-2' : ''
              )}
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'></div>
              {!collapsed && (
                <div className='flex w-full flex-1 flex-col'>
                  <span className='font-medium text-blue-600'>{user.name}</span>
                  <span className='text-sm text-gray-500'>{user.email}</span>
                </div>
              )}
            </Card>

            {/* Upgrade block */}
            {!collapsed && (
              <div className='mt-3 rounded-xl bg-gradient-to-r from-yellow-200 to-lime-200 p-3 text-sm text-gray-800'>
                <div className='flex items-center gap-2'>
                  <ArrowUpCircle className='h-8 w-8 text-purple-600' />
                  <span>Upgrade your plan to unlock Premium features</span>
                </div>
              </div>
            )}

            <div className='my-4 border-t' />
            <div className='mt-6 flex w-full flex-1 flex-col'>
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
                      />
                    )
                  );
                })}
              </div>
            </div>
            <div className='mt-auto pt-4'>
              <Button
                variant='ghost'
                className={cn(
                  'w-full rounded-xl bg-violet-50 font-medium hover:bg-violet-100',
                  collapsed ? 'justify-center' : ''
                )}
                onClick={handleLayout}
              >
                <LogOut className='h-5 w-5' />
                {!collapsed && <span>LOGOUT</span>}
              </Button>
            </div>
          </aside>
        </div>
      </div>
      <main className='w-full bg-white'>{children}</main>
    </div>
  );
}
