'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { GetOrderItemsWithUserDto } from '@/generated/orval/types';
import { AdminOrderItemRow } from './AdminOrderItemRow';

interface AdminOrderItemsListProps {
  orderItems: GetOrderItemsWithUserDto[];
  isShowConfirmBtn: boolean;
  isShowRefundBtn: boolean;
  isLoadingDistributeItem: boolean;
  isLoadingRefundItem: boolean;
  onDistributeItem: (id: string) => void;
  onRefundItem: (id: string) => void;
}

export function AdminOrderItemsList({
  orderItems,
  isShowConfirmBtn,
  isShowRefundBtn,
  isLoadingDistributeItem,
  isLoadingRefundItem,
  onDistributeItem,
  onRefundItem,
}: AdminOrderItemsListProps) {
  const t = useTranslations('Modals');

  return (
    <div className='p-4'>
      <h3 className='mb-3 text-sm font-semibold'>{t('order_items_title')}</h3>
      <div className='max-h-[400px] space-y-3 overflow-y-auto pr-2'>
        {orderItems.map((item) => (
          <AdminOrderItemRow
            key={item.id}
            item={item}
            isShowConfirmBtn={isShowConfirmBtn}
            isShowRefundBtn={isShowRefundBtn}
            isLoadingDistribute={isLoadingDistributeItem}
            isLoadingRefund={isLoadingRefundItem}
            onDistribute={onDistributeItem}
            onRefund={onRefundItem}
          />
        ))}
      </div>
    </div>
  );
}
