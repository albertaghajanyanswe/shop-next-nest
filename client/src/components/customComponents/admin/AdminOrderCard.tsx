'use client';

import React from 'react';
import { GetOrderWithItemsDto } from '@/generated/orval/types';
import { formatDateWithHour } from '@/utils/formateDate';
import { STATUS_COLOR } from '@/utils/colorUtils';
import { formatPrice } from '@/utils/formatPrice';
import { useProfile } from '@/hooks/useProfile';
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
  Package,
  User,
  Mail,
  Calendar,
  Hash,
  ShoppingBag,
} from 'lucide-react';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { useRefundOrder } from '@/hooks/stripe/useRefundOrder';
import { useDistributeFundsOrderItem } from '@/hooks/stripe/useDistributeFundsOrderItem';
import { useRefundOrderItem } from '@/hooks/stripe/useRefundOrderItem';
import { GetOrderItemsWithUserDtoStatus } from '@/generated/orval/types';

interface AdminOrderCardProps {
  order: GetOrderWithItemsDto;
  showConfirm?: boolean;
  showRefund?: boolean;
}

export function AdminOrderCard({
  order,
  showConfirm = false,
  showRefund = false,
}: AdminOrderCardProps) {
  const { user } = useProfile();
  const t = useTranslations('Modals');
  const dashT = useTranslations('DashboardSettings');

  const { distributeFundsOrder, isLoadingDistributeFundsOrder } =
    useDistributeFundsOrder();
  const { refundOrder, isLoadingRefundOrder } = useRefundOrder();
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } =
    useDistributeFundsOrderItem();
  const { refundOrderItem, isLoadingRefundOrderItem } = useRefundOrderItem();

  const isShowRefundBtn =
    user?.role === 'SUPER_ADMIN' && order.id && showRefund;
  const isShowConfirmBtn =
    user?.role === 'SUPER_ADMIN' && order.id && showConfirm;

  return (
    <div className='bg-card overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md'>
      {/* Header Section */}
      <div className='bg-shop-green-hover border-b p-4'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='min-w-0 flex-1 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <Hash className='text-muted-foreground h-4 w-4 flex-shrink-0' />
              <span className='text-muted-foreground text-sm font-medium'>
                {t('order_info_id')}:
              </span>
              <span className='font-mono text-sm break-all'>{order.id}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Package className='text-muted-foreground h-4 w-4 flex-shrink-0' />
              <span className='text-muted-foreground text-sm font-medium'>
                {t('order_info_type')}:
              </span>
              <span className='text-sm'>
                {order.subscriptionId
                  ? dashT('type_subscription')
                  : dashT('type_product')}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_COLOR[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Info Section */}
      <div className='bg-muted/30 border-b p-4'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <User className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {t('order_info_customer')}
              </p>
              <p className='truncate text-sm font-medium'>{order.user.name}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Mail className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {t('order_info_email')}
              </p>
              <p className='truncate text-sm font-medium'>{order.user.email}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Calendar className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {t('order_info_date')}
              </p>
              <p className='text-sm font-medium'>
                {formatDateWithHour(order.createdAt as string)}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <ShoppingBag className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {t('order_items_title')}
              </p>
              <p className='text-sm font-medium'>
                {order.orderItems.length}{' '}
                {order.orderItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Section */}
      <div className='p-4'>
        <h3 className='mb-3 text-sm font-semibold'>{t('order_items_title')}</h3>
        <div className='max-h-[400px] space-y-3 overflow-y-auto pr-2'>
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className='bg-shop-green-hover/50 hover:bg-shop-green-hover rounded-lg border p-3 transition-colors'
            >
              <div className='flex gap-3'>
                <div className='bg-background relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md'>
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
                  {(showConfirm || showRefund) && (
                    <div className='flex gap-2 pt-2'>
                      {showConfirm && (
                        <Button
                          disabled={
                            isLoadingDistributeFundsOrderItem ||
                            item.status ===
                              GetOrderItemsWithUserDtoStatus.CONFIRMED
                          }
                          onClick={() => {
                            if (
                              item.status !==
                              GetOrderItemsWithUserDtoStatus.CONFIRMED
                            ) {
                              distributeFundsOrderItem(item.id);
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
                      {showRefund && (
                        <Button
                          disabled={
                            isLoadingRefundOrderItem ||
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
                              refundOrderItem(item.id);
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
          ))}
        </div>
      </div>

      {/* Total Section */}
      <div className='bg-muted/20 border-t p-4'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex gap-2'>
            {isShowConfirmBtn && (
              <Button
                disabled={isLoadingDistributeFundsOrder}
                onClick={() => distributeFundsOrder(order.id)}
                variant='default'
                size='sm'
              >
                <CircleDollarSignIcon className='h-4 w-4' />
                {t('order_btn_confirm')}
              </Button>
            )}
            {isShowRefundBtn && (
              <Button
                disabled={isLoadingRefundOrder}
                onClick={() => refundOrder(order.id)}
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
              {formatPrice(order.totalPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
