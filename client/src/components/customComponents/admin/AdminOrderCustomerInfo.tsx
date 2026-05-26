'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { formatDateWithHour } from '@/utils/formatDate';
import { User, Mail, Calendar, ShoppingBag } from 'lucide-react';

interface AdminOrderCustomerInfoProps {
  userName: string;
  userEmail: string;
  createdAt: string;
  itemsCount: number;
}

export function AdminOrderCustomerInfo({
  userName,
  userEmail,
  createdAt,
  itemsCount,
}: AdminOrderCustomerInfoProps) {
  const t = useTranslations('Modals');

  return (
    <div className='bg-shop-bg border-b p-4'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='flex items-center gap-2'>
          <User className='text-muted-foreground h-4 w-4 shrink-0' />
          <div className='min-w-0 flex-1'>
            <p className='text-muted-foreground text-xs'>
              {t('order_info_customer')}
            </p>
            <p className='truncate text-sm font-medium'>{userName}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Mail className='text-muted-foreground h-4 w-4 shrink-0' />
          <div className='min-w-0 flex-1'>
            <p className='text-muted-foreground text-xs'>
              {t('order_info_email')}
            </p>
            <p className='truncate text-sm font-medium'>{userEmail}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Calendar className='text-muted-foreground h-4 w-4 shrink-0' />
          <div className='min-w-0 flex-1'>
            <p className='text-muted-foreground text-xs'>
              {t('order_info_date')}
            </p>
            <p className='text-sm font-medium'>
              {formatDateWithHour(createdAt)}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <ShoppingBag className='text-muted-foreground h-4 w-4 shrink-0' />
          <div className='min-w-0 flex-1'>
            <p className='text-muted-foreground text-xs'>
              {t('order_items_title')}
            </p>
            <p className='text-sm font-medium'>
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
