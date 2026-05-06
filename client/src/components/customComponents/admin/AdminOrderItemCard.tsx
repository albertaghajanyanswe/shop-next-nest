'use client';

import React from 'react';
import {
  GetOrderItemsDetailsDto,
  GetUserDto,
  GetOrderItemsDetailsDtoStatus,
} from '@/generated/orval/types';
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
import {
  CircleDollarSignIcon,
  RotateCcw,
  User,
  Mail,
  Calendar,
  Hash,
  Package,
  ShoppingCart,
} from 'lucide-react';
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
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } =
    useDistributeFundsOrderItem();
  const { refundOrderItem, isLoadingRefundOrderItem } = useRefundOrderItem();

  const isShowDistributeBtn = showConfirm && orderItem.id;
  const isShowRefundBtn = showRefund && orderItem.id;

  return (
    <div className='bg-card overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md'>
      {/* Header Section with Product Image */}
      <div className='bg-shop-green-hover border-b p-4'>
        <div className='flex gap-4'>
          <div className='bg-background relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg'>
            <Image
              src={generateImgPath(
                orderItem.cachedProductImages[0],
                categoryImgParams
              )}
              alt={orderItem.cachedProductTitle as string}
              width={96}
              height={96}
              {...(generateImgPath(
                orderItem.cachedProductImages[0],
                categoryImgBlurParams
              ) && {
                placeholder: 'blur',
                blurDataURL: generateImgPath(
                  orderItem.cachedProductImages[0],
                  categoryImgBlurParams
                ),
              })}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='min-w-0 flex-1 space-y-2'>
            <h3 className='line-clamp-2 text-lg font-semibold'>
              {orderItem.cachedProductTitle}
            </h3>
            <div className='flex items-center gap-2'>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[orderItem.order.status]}`}
              >
                {orderItem.order.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Item Info Section */}
      <div className='bg-muted/30 border-b p-4'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <Hash className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {t('order_item_info_id')}
              </p>
              <p className='font-mono text-sm break-all'>{orderItem.id}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {t('order_info_date')}
              </p>
              <p className='text-sm font-medium'>
                {formatDateWithHour(orderItem.createdAt as string)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Section */}
      <div className='border-b p-4'>
        <h4 className='mb-3 text-sm font-semibold'>
          {t('order_info_customer')}
        </h4>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <User className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {t('order_info_customer')}
              </p>
              <p className='truncate text-sm font-medium'>
                {orderItem.order.user.name}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Mail className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {t('order_info_email')}
              </p>
              <p className='truncate text-sm font-medium'>
                {orderItem.order.user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className='bg-muted/20 border-b p-4'>
        <h4 className='mb-3 text-sm font-semibold'>Product Details</h4>
        <div className='space-y-2 text-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground flex items-center gap-2'>
              <Package className='h-4 w-4' />
              {t('order_col_quantity')}
            </span>
            <span className='font-semibold'>{orderItem.quantity}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground flex items-center gap-2'>
              <ShoppingCart className='h-4 w-4' />
              {t('order_col_price')}
            </span>
            <span className='text-shop-red font-semibold'>
              ${orderItem.price.toFixed(2)}
            </span>
          </div>
          <div className='space-y-1 border-t pt-2 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                {t('order_product_id')}:
              </span>
              <span className='ml-2 font-mono break-all'>
                {orderItem.productId}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                {t('order_store_id')}:
              </span>
              <span className='ml-2 font-mono break-all'>
                {orderItem.storeId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Total and Actions Section */}
      <div className='bg-muted/10 p-4'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex gap-2'>
            {isShowDistributeBtn && (
              <Button
                disabled={
                  isLoadingDistributeFundsOrderItem ||
                  orderItem.status === GetOrderItemsDetailsDtoStatus.CONFIRMED
                }
                onClick={() => {
                  if (
                    orderItem.status !== GetOrderItemsDetailsDtoStatus.CONFIRMED
                  ) {
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
                    orderItem.status !==
                      GetOrderItemsDetailsDtoStatus.REFUNDED &&
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
            <p className='text-muted-foreground text-sm'>{t('order_total')}</p>
            <p className='text-shop-red text-2xl font-bold'>
              {formatPrice(orderItem.price * orderItem.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
