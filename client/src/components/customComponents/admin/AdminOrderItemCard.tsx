'use client';

import React from 'react';
import { GetOrderItemsDetailsDto, GetUserDto, GetOrderItemsDetailsDtoStatus } from '@/generated/orval/types';
import { formatDateWithHour } from '@/utils/formateDate';
import { STATUS_COLOR } from '@/utils/colorUtils';
import { formatPrice } from '@/utils/formatPrice';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  categoryImgBlurParams,
  categoryImgParams,
  generateImgPath,
} from '@/utils/imageUtils';
import { Button } from '@/components/ui/Button';
import { CircleDollarSignIcon, RotateCcw, User, Mail, Calendar, Hash, Package, ShoppingCart } from 'lucide-react';
import { useDistributeFundsOrderItem } from '@/hooks/stripe/useDistributeFundsOrderItem';
import { useRefundOrderItem } from '@/hooks/stripe/useRefundOrderItem';

interface AdminOrderItemCardProps {
  orderItem: GetOrderItemsDetailsDto;
  user: GetUserDto;
  showConfirm?: boolean;
  showRefund?: boolean;
}

export function AdminOrderItemCard({
  orderItem,
  user,
  showConfirm = false,
  showRefund = false,
}: AdminOrderItemCardProps) {
  const t = useTranslations('Modals');
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } = useDistributeFundsOrderItem();
  const { refundOrderItem, isLoadingRefundOrderItem } = useRefundOrderItem();

  const isShowDistributeBtn = showConfirm && orderItem.id;
  const isShowRefundBtn = showRefund && orderItem.id;

  return (
    <div className='rounded-xl border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden'>
      {/* Header Section with Product Image */}
      <div className='bg-shop-green-hover p-4 border-b'>
        <div className='flex gap-4'>
          <div className='relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-background'>
            <Image
              src={generateImgPath(orderItem.cachedProductImages[0], categoryImgParams)}
              alt={orderItem.cachedProductTitle as string}
              width={96}
              height={96}
              {...(generateImgPath(orderItem.cachedProductImages[0], categoryImgBlurParams) && {
                placeholder: 'blur',
                blurDataURL: generateImgPath(orderItem.cachedProductImages[0], categoryImgBlurParams),
              })}
              className='object-cover h-full w-full'
            />
          </div>
          <div className='flex-1 min-w-0 space-y-2'>
            <h3 className='text-lg font-semibold line-clamp-2'>{orderItem.cachedProductTitle}</h3>
            <div className='flex items-center gap-2'>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[orderItem.order.status]}`}>
                {orderItem.order.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Item Info Section */}
      <div className='p-4 bg-muted/30 border-b'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='flex items-center gap-2'>
            <Hash className='h-4 w-4 text-muted-foreground flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-xs text-muted-foreground'>{t('order_item_info_id')}</p>
              <p className='text-sm font-mono break-all'>{orderItem.id}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-xs text-muted-foreground'>{t('order_info_date')}</p>
              <p className='text-sm font-medium'>{formatDateWithHour(orderItem.createdAt as string)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Section */}
      <div className='p-4 border-b'>
        <h4 className='text-sm font-semibold mb-3'>{t('order_info_customer')}</h4>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='flex items-center gap-2'>
            <User className='h-4 w-4 text-muted-foreground flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-xs text-muted-foreground'>{t('order_info_customer')}</p>
              <p className='text-sm font-medium truncate'>{orderItem.order.user.name}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Mail className='h-4 w-4 text-muted-foreground flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-xs text-muted-foreground'>{t('order_info_email')}</p>
              <p className='text-sm font-medium truncate'>{orderItem.order.user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className='p-4 bg-muted/20 border-b'>
        <h4 className='text-sm font-semibold mb-3'>Product Details</h4>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between items-center'>
            <span className='text-muted-foreground flex items-center gap-2'>
              <Package className='h-4 w-4' />
              {t('order_col_quantity')}
            </span>
            <span className='font-semibold'>{orderItem.quantity}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-muted-foreground flex items-center gap-2'>
              <ShoppingCart className='h-4 w-4' />
              {t('order_col_price')}
            </span>
            <span className='font-semibold text-shop-red'>${orderItem.price.toFixed(2)}</span>
          </div>
          <div className='pt-2 border-t space-y-1 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('order_product_id')}:</span>
              <span className='font-mono break-all ml-2'>{orderItem.productId}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('order_store_id')}:</span>
              <span className='font-mono break-all ml-2'>{orderItem.storeId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total and Actions Section */}
      <div className='p-4 bg-muted/10'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex gap-2'>
            {isShowDistributeBtn && (
              <Button
                disabled={
                  isLoadingDistributeFundsOrderItem ||
                  orderItem.status === GetOrderItemsDetailsDtoStatus.CONFIRMED
                }
                onClick={() => {
                  if (orderItem.status !== GetOrderItemsDetailsDtoStatus.CONFIRMED) {
                    distributeFundsOrderItem(orderItem.id);
                  }
                }}
                variant='default'
                size='sm'
              >
                <CircleDollarSignIcon className='h-4 w-4' />
                {orderItem.status === GetOrderItemsDetailsDtoStatus.CONFIRMED
                  ? t('order_btn_confirmed')
                  : t('order_btn_confirm')}
              </Button>
            )}
            {isShowRefundBtn && (
              <Button
                disabled={
                  isLoadingRefundOrderItem ||
                  orderItem.status === GetOrderItemsDetailsDtoStatus.REFUNDED ||
                  orderItem.status === GetOrderItemsDetailsDtoStatus.CONFIRMED
                }
                onClick={() => {
                  if (
                    orderItem.status !== GetOrderItemsDetailsDtoStatus.REFUNDED &&
                    orderItem.status !== GetOrderItemsDetailsDtoStatus.CONFIRMED
                  ) {
                    refundOrderItem(orderItem.id);
                  }
                }}
                variant='outline'
                size='sm'
              >
                <RotateCcw className='h-4 w-4' />
                {orderItem.status === GetOrderItemsDetailsDtoStatus.REFUNDED
                  ? t('order_btn_refunded')
                  : t('order_btn_refund')}
              </Button>
            )}
          </div>
          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>{t('order_total')}</p>
            <p className='text-2xl font-bold text-shop-red'>{formatPrice(orderItem.price * orderItem.quantity)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
