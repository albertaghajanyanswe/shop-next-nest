'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Hash, Package } from 'lucide-react';
import { STATUS_COLOR } from '@/utils/colorUtils';

interface AdminOrderHeaderProps {
  id: string;
  subscriptionId: string | null | undefined;
  status: string;
}

export function AdminOrderHeader({
  id,
  subscriptionId,
  status,
}: AdminOrderHeaderProps) {
  const t = useTranslations('Modals');
  const dashT = useTranslations('DashboardSettings');

  return (
    <div className='bg-shop-bg p-4'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='min-w-0 flex-1 space-y-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Hash className='text-muted-foreground h-4 w-4 shrink-0' />
            <span className='text-muted-foreground text-sm font-medium'>
              {t('order_info_id')}:
            </span>
            <span className='font-mono text-sm break-all'>{id}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Package className='text-muted-foreground h-4 w-4 shrink-0' />
            <span className='text-muted-foreground text-sm font-medium'>
              {t('order_info_type')}:
            </span>
            <span className='text-sm'>
              {subscriptionId
                ? dashT('type_subscription')
                : dashT('type_product')}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_COLOR[status as keyof typeof STATUS_COLOR]}`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
