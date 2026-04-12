import React from 'react';
import Image from 'next/image';
import {
  ImageItemConfig,
  TableSectionColumn,
  TableSectionItem,
} from '../OrderDetailsModal';
import { useDistributeFundsOrderItem } from '@/hooks/stripe/useDistributeFundsOrderItem';
import {
  GetOrderItemsWithUserDtoStatus,
  GetUserDto,
} from '@/generated/orval/types';
import { Button } from '@/components/ui/Button';
import { CircleDollarSignIcon, RotateCcw } from 'lucide-react';
import { useRefundOrderItem } from '@/hooks/stripe/useRefundOrderItem';
import { useTranslations } from 'next-intl';

interface GenericTableProps<T extends TableSectionItem> {
  columns: TableSectionColumn[];
  items: T[];
  renderCell?: (item: T, column: TableSectionColumn) => React.ReactNode;
  className?: string;
  user: GetUserDto;
  showConfirm?: boolean;
  showRefund?: boolean;
}

function DefaultCellRenderer<T extends TableSectionItem>(
  item: T,
  column: TableSectionColumn
): React.ReactNode {
  const value = item[column.key];

  if (column.type === 'text') {
    return (
      <span
        className={`text-sm font-medium ${column.key === 'price' ? 'text-shop-red' : 'text-shop-muted-text-7'}`}
      >
        {value}
      </span>
    );
  }

  if (column.type === 'image' && value) {
    const config = value as ImageItemConfig;
    return (
      <div className='flex flex-row items-center gap-3 sm:col-span-6'>
        <div className='relative h-15 w-15'>
          <Image
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            {...(config.blurDataURL && {
              placeholder: 'blur',
              blurDataURL: config.blurDataURL,
            })}
            className='max-h-15 object-contain'
          />
        </div>
        <p className='text-sm font-medium text-shop-muted-text-7'>{item.title}</p>
      </div>
    );
  }

  return <span className='text-sm'>{value}</span>;
}

export function ItemsTable<T extends TableSectionItem>({
  columns,
  items,
  renderCell = DefaultCellRenderer,
  className = '',
  user,
  showConfirm,
  showRefund,
}: GenericTableProps<T>) {
  const t = useTranslations('Modals');
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } =
    useDistributeFundsOrderItem();

  const { refundOrderItem, isLoadingRefundOrderItem } = useRefundOrderItem();
  
  return (
    <div className={`space-y-3 wrap-anywhere ${className}`}>
      <div className='hidden grid-cols-12 gap-4 p-0 text-sm font-semibold text-shop-primary-text sm:grid'>
        {columns.map((col) => (
          <div key={col.key} className={`${col.span || 'col-span-3'}`}>
            {col.title}
          </div>
        ))}
      </div>

      {/* Rows */}
      {items.map((item) => (
        <div
          key={item.id}
          className='border-shop-light-primary/70 xs:max-w-none max-w-fit gap-4 rounded-lg border px-4 py-4 dark:bg-shop-green-hover'
        >
          <div className='flex flex-col gap-4 sm:grid sm:grid-cols-12'>
            {columns.map((col) => (
              <div
                key={`${item.id}-${col.key}`}
                className={`${col.span || 'col-span-3'} flex items-center justify-between wrap-anywhere`}
              >
                <span className='text-sm font-semibold text-shop-primary-text sm:hidden'>
                  {col.title}
                </span>

                {renderCell(item, col)}
              </div>
            ))}
          </div>
          <div className='xs:items-start mt-4 flex flex-col justify-between sm:mt-2 sm:items-center'>
            <div className='w-full border-t border-neutral-200 pt-4'>
              <div className='mb-4 flex w-full flex-row justify-between text-xs sm:mb-0'>
                <p className='text-sm font-semibold'>{t('order_item_id')}</p>{' '}
                <span className='ml-2'>{item.id || '-'}</span>
              </div>
              <div className='mb-4 flex w-full flex-row justify-between text-xs sm:mb-0'>
                <p className='text-sm font-semibold'>{t('order_product_id')}</p>{' '}
                <span className='ml-2'>{item.productId || '-'}</span>
              </div>
              <div className='mb-4 flex w-full flex-row justify-between text-xs sm:mb-0'>
                <p className='text-sm font-semibold'>{t('order_store_id')}</p>{' '}
                <span className='ml-2'>{item.storeId || '-'}</span>
              </div>
            </div>
            <div className='mt-2 flex flex-row gap-1 self-start'>
              {item.orderItemId && showConfirm && (
                <Button
                  disabled={
                    isLoadingDistributeFundsOrderItem ||
                    item.orderItemStatus ===
                      GetOrderItemsWithUserDtoStatus.CONFIRMED
                  }
                  onClick={() => {
                    if (
                      item.orderItemStatus !==
                      GetOrderItemsWithUserDtoStatus.CONFIRMED
                    ) {
                      distributeFundsOrderItem(item.orderItemId);
                    }
                  }}
                  variant='outline'
                  className='text-xs'
                >
                  <CircleDollarSignIcon />
                  {item.orderItemStatus ===
                  GetOrderItemsWithUserDtoStatus.CONFIRMED
                    ? t('order_btn_confirmed')
                    : t('order_btn_confirm')}
                </Button>
              )}
              {item.orderItemId && showRefund && (
                <Button
                  disabled={
                    isLoadingRefundOrderItem ||
                    item.orderItemStatus ===
                      GetOrderItemsWithUserDtoStatus.REFUNDED ||
                    item.orderItemStatus ===
                      GetOrderItemsWithUserDtoStatus.CONFIRMED
                  }
                  onClick={() => {
                    if (
                      item.orderItemStatus !==
                        GetOrderItemsWithUserDtoStatus.REFUNDED &&
                      item.orderItemStatus !==
                        GetOrderItemsWithUserDtoStatus.CONFIRMED
                    ) {
                      refundOrderItem(item.orderItemId);
                    }
                  }}
                  variant='outline'
                  className='text-xs'
                >
                  <RotateCcw />
                  {item.orderItemStatus ===
                  GetOrderItemsWithUserDtoStatus.REFUNDED
                    ? t('order_btn_refunded')
                    : t('order_btn_refund')}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
