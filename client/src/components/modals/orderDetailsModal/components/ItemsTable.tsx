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
import { CircleDollarSignIcon } from 'lucide-react';

interface GenericTableProps<T extends TableSectionItem> {
  columns: TableSectionColumn[];
  items: T[];
  renderCell?: (item: T, column: TableSectionColumn) => React.ReactNode;
  className?: string;
  user: GetUserDto;
  showConfirm?: boolean;
}

function DefaultCellRenderer<T extends TableSectionItem>(
  item: T,
  column: TableSectionColumn
): React.ReactNode {
  const value = item[column.key];

  if (column.type === 'text') {
    return (
      <span
        className={`text-sm font-medium ${column.key === 'price' ? 'text-shop-red' : 'text-neutral-700'}`}
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
        <p className='text-sm font-medium text-neutral-700'>{item.title}</p>
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
}: GenericTableProps<T>) {
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } =
    useDistributeFundsOrderItem();

  console.log('items - ', items);
  return (
    <div className={`space-y-3 ${className}`}>
      <div className='hidden grid-cols-12 gap-4 p-0 text-sm font-semibold text-neutral-700 sm:grid'>
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
          className='border-shop-light-green/70 gap-4 rounded-lg border p-2'
        >
          <div className='flex flex-col gap-4 sm:grid sm:grid-cols-12'>
            {columns.map((col) => (
              <div
                key={`${item.id}-${col.key}`}
                className={`${col.span || 'col-span-3'} flex items-center justify-between wrap-anywhere`}
              >
                <span className='text-sm font-semibold text-neutral-700 sm:hidden'>
                  {col.title}
                </span>

                {renderCell(item, col)}
              </div>
            ))}
          </div>
          <div className='xs:items-start mt-4 flex flex-col justify-between sm:mt-2 sm:flex-row sm:items-center'>
            <div className='mr-4 w-full'>
              <p className='mb-4 flex w-full flex-row justify-between text-xs sm:mb-0'>
                <b className='text-sm'>Order Item ID:</b>{' '}
                <span className='ml-2'>{item.id}</span>
              </p>
              <p className='mb-4 flex w-full flex-row justify-between text-xs sm:mb-0'>
                <b className='text-sm'>Product ID:</b>{' '}
                <span className='ml-2'>{item.productId}</span>
              </p>
              <p className='mb-4 flex w-full flex-row justify-between text-xs sm:mb-0'>
                <b className='text-sm'>Store ID:</b>{' '}
                <span className='ml-2'>{item.storeId}</span>
              </p>
            </div>
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
              >
                <CircleDollarSignIcon />
                {item.orderItemStatus ===
                GetOrderItemsWithUserDtoStatus.CONFIRMED
                  ? 'Confirmed'
                  : 'Confirm'}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
