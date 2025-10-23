'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { saveTokenStorage } from '@/services/auth/auth-token.service';
import { authService } from '@/services/auth/auth.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IOrderColumns, orderColumns } from './OrderColumns';
import { useProfile } from '@/hooks/useProfile';
import { EnumOrderStatus } from '@/shared/types/order.interface';
import { formatPrice } from '@/utils/string/formatPrice';
import { formateDate } from '@/utils/date/formateDate';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/data-loading/DataTable';
import SubscriptionCards from '@/components/ui/subscriptions/Subscriptions';
import {
  Brush,
  Image as ImageIcon,
  Layers3,
  CreditCard,
  Package,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowUpCircle,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

const menuItems = [
  { value: 'Artist Profile', icon: Brush },
  { value: 'Artworks', icon: ImageIcon },
  { value: '3D Galleries', icon: Layers3 },
  { value: 'Guided Tours', icon: Brush },
  { value: 'Collections', icon: Package },
  { value: 'Payout Account', icon: CreditCard },
  { value: 'All Orders', icon: Brush },
  { value: 'Support service', icon: HelpCircle },
];

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    if (accessToken) {
      saveTokenStorage(accessToken);
    }
  }, [searchParams]);

  const { user } = useProfile();

  const { mutate: logout } = useMutation({
    mutationKey: QUERY_KEYS.logout,
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.push('/auth');
    },
  });

  if (!user) return null;

  const formattedOrders: IOrderColumns[] = user.orders.map((order) => ({
    createdAt: formateDate(order.createdAt as unknown as string),
    status: order.status === EnumOrderStatus.PENDING ? 'Pending' : 'Paid',
    total: formatPrice(order.totalPrice),
  }));

  return (
    <div className='my-6 flex w-full flex-row gap-2'>
      <div className='layout'>
        <div className='inset-y-0 z-[50] flex h-full flex-col'>
          <aside
            className={cn(
              'flex flex-col rounded-2xl bg-white shadow-sm transition-all duration-300',
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
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                {/* <img
                  src=''
                  alt='avatar'
                  className='h-10 w-10 rounded-full object-cover'
                /> */}
              </div>
              {!collapsed && (
                <div className='flex flex-1 flex-col'>
                  <span className='font-medium text-blue-600'>a1</span>
                  <span className='text-sm text-gray-500'>
                    test-a1@yopmail.com
                  </span>
                </div>
              )}
              {!collapsed && <ChevronRight className='h-4 w-4 text-gray-400' />}
            </Card>

            {/* Upgrade block */}
            {!collapsed && (
              <div className='mt-3 rounded-xl bg-gradient-to-r from-yellow-200 to-lime-200 p-3 text-sm text-gray-800'>
                <div className='flex items-center gap-2'>
                  <ArrowUpCircle className='h-5 w-5 text-purple-600' />
                  <span>Upgrade your plan to unlock Premium features</span>
                </div>
              </div>
            )}

            <div className='my-4 border-t' />

            {/* Menu */}
            <nav className='flex flex-col gap-1'>
              {menuItems.map(({ value, icon: Icon }) => (
                <Button
                  key={value}
                  variant='ghost'
                  className={cn(
                    'flex items-center justify-start gap-3 rounded-xl text-base font-normal hover:bg-gray-50',
                    collapsed ? 'justify-center' : 'px-4 py-3'
                  )}
                >
                  <Icon className='h-5 w-5' />
                  {!collapsed && <span>{value}</span>}
                </Button>
              ))}
            </nav>
            {menuItems.map((route) => (
              <MenuItem key={route.value} route={route} />
            ))}
            <div className='mt-auto pt-4'>
              <Button
                variant='ghost'
                className={cn(
                  'w-full rounded-xl bg-violet-50 font-medium hover:bg-violet-100',
                  collapsed ? 'justify-center' : ''
                )}
              >
                <LogOut className='h-5 w-5' />
                {!collapsed && <span>LOGOUT</span>}
              </Button>
            </div>
          </aside>
        </div>
      </div>
      <main className='bg-white p-4'>Test</main>
    </div>
  );
}
