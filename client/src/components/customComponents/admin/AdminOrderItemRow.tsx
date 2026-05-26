'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CircleDollarSignIcon, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  categoryImgBlurParams,
  categoryImgParams,
  generateImgPath,
} from '@/utils/imageUtils';
import { GetOrderItemsWithUserDto, GetOrderItemsWithUserDtoStatus } from '@/generated/orval/types';

interface AdminOrderItemRowProps {
  item: GetOrderItemsWithUserDto;
  isShowConfirmBtn: boolean;
  isShowRefundBtn: boolean;
  isLoadingDistribute: boolean;
  isLoadingRefund: boolean;
  onDistribute: (id: string) => void;
  onRefund: (id: string) => void;
}

export function AdminOrderItemRow({
  item,
  isShowConfirmBtn,
  isShowRefundBtn,
  isLoadingDistribute,
  isLoadingRefund,
  onDistribute,
  onRefund,
}: AdminOrderItemRowProps) {
  const t = useTranslations('Modals');

  return (
    <div className='bg-shop-bg-default rounded-md border p-3 shadow-md transition-colors'>
      <div className='flex gap-3'>
        <div className='bg-background relative h-16 w-16 shrink-0 overflow-hidden rounded-md'>
          <Image
            src={generateImgPath(
              item.cachedProductImages[0],
              categoryImgParams
            )}
            alt={item.cachedProductTitle as string}
            width={64}
            height={64}
            {...(generateImgPath(
              item.cachedProductImages[0],
              categoryImgBlurParams
            ) && {
              placeholder: 'blur',
              blurDataURL: generateImgPath(
                item.cachedProductImages[0],
                categoryImgBlurParams
              ),
            })}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='min-w-0 flex-1 space-y-2'>
          <p className='line-clamp-2 text-sm font-medium'>
            {item.cachedProductTitle}
          </p>
          <div className='text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs'>
            <span>
              {t('order_col_user')}: {item.user.email}
            </span>
            <span>
              {t('order_col_quantity')}: {item.quantity}
            </span>
            <span className='text-shop-red font-semibold'>
              ${item.price.toFixed(2)}
            </span>
          </div>
          <div className='space-y-1 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                {t('order_item_id')}:
              </span>
              <span className='ml-2 font-mono text-xs break-all'>
                {item.id}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                {t('order_product_id')}:
              </span>
              <span className='ml-2 font-mono text-xs break-all'>
                {item.productId}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                {t('order_store_id')}:
              </span>
              <span className='ml-2 font-mono text-xs break-all'>
                {item.storeId}
              </span>
            </div>
          </div>
          {(isShowConfirmBtn || isShowRefundBtn) && (
            <div className='flex gap-2 pt-2'>
              {isShowConfirmBtn && (
                <Button
                  disabled={
                    isLoadingDistribute ||
                    item.status ===
                      GetOrderItemsWithUserDtoStatus.CONFIRMED
                  }
                  onClick={() => {
                    if (
                      item.status !==
                      GetOrderItemsWithUserDtoStatus.CONFIRMED
                    ) {
                      onDistribute(item.id);
                    }
                  }}
                  variant='outline'
                  size='sm'
                  className='text-xs'
                >
                  <CircleDollarSignIcon className='h-3 w-3' />
                  {item.status ===
                  GetOrderItemsWithUserDtoStatus.CONFIRMED
                    ? t('order_btn_confirmed')
                    : t('order_btn_confirm')}
                </Button>
              )}
              {isShowRefundBtn && (
                <Button
                  disabled={
                    isLoadingRefund ||
                    item.status ===
                      GetOrderItemsWithUserDtoStatus.REFUNDED ||
                    item.status ===
                      GetOrderItemsWithUserDtoStatus.CONFIRMED
                  }
                  onClick={() => {
                    if (
                      item.status !==
                        GetOrderItemsWithUserDtoStatus.REFUNDED &&
                      item.status !==
                        GetOrderItemsWithUserDtoStatus.CONFIRMED
                    ) {
                      onRefund(item.id);
                    }
                  }}
                  variant='outline'
                  size='sm'
                  className='text-xs'
                >
                  <RotateCcw className='h-3 w-3' />
                  {item.status ===
                  GetOrderItemsWithUserDtoStatus.REFUNDED
                    ? t('order_btn_refunded')
                    : t('order_btn_refund')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
