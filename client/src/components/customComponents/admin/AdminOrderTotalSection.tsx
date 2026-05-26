'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/utils/formatPrice';
import { CircleDollarSignIcon, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminOrderTotalSectionProps {
  orderId: string;
  isShowConfirmBtn: boolean;
  isShowRefundBtn: boolean;
  isLoadingDistribute: boolean;
  isLoadingRefund: boolean;
  totalPrice: number;
  onDistribute: (id: string) => void;
  onRefund: (id: string) => void;
}

export function AdminOrderTotalSection({
  orderId,
  isShowConfirmBtn,
  isShowRefundBtn,
  isLoadingDistribute,
  isLoadingRefund,
  totalPrice,
  onDistribute,
  onRefund,
}: AdminOrderTotalSectionProps) {
  const t = useTranslations('Modals');

  return (
    <div className='bg-shop-bg border-t p-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex gap-2'>
          {isShowConfirmBtn && (
            <Button
              disabled={isLoadingDistribute}
              onClick={() => onDistribute(orderId)}
              variant='default'
              size='sm'
            >
              <CircleDollarSignIcon className='h-4 w-4' />
              {t('order_btn_confirm')}
            </Button>
          )}
          {isShowRefundBtn && (
            <Button
              disabled={isLoadingRefund}
              onClick={() => onRefund(orderId)}
              variant='outline'
              size='sm'
            >
              <RotateCcw className='h-4 w-4' />
              {t('order_btn_refund_order')}
            </Button>
          )}
        </div>
        <div className='text-right'>
          <p className='text-muted-foreground text-sm'>{t('order_total')}</p>
          <p className='text-shop-red text-2xl font-bold'>
            {formatPrice(totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
