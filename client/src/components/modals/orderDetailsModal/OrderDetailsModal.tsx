import React from 'react';
import { CustomModal } from '@/components/modals/CustomModal';
import { InfoSection } from './InfoSection';
import { ItemsTable } from './ItemsTable';
import { GetOrderWithItemsDto } from '@/generated/orval/types';
import { formatDateWithHour } from '@/utils/formateDate';
import { STATUS_COLOR } from '@/utils/colorUtils';
import {
  categoryImgBlurParams,
  categoryImgParams,
  generateImgPath,
} from '@/utils/imageUtils';
import { TotalSection } from './TotalSection';

export type CellType = 'text' | 'image';

export interface InfoSectionItem {
  title: string;
  value: string | React.ReactNode;
  className?: string;
}

export interface TableSectionColumn {
  key: string;
  title: string;
  type: CellType;
  span?: number;
}

export interface TableSectionItem {
  id: string;
  [key: string]: any;
}

export interface ImageItemConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

interface OrderDetailsModalProps<T extends TableSectionItem> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  order: GetOrderWithItemsDto;
}

export function OrderDetailsModal<T extends TableSectionItem>({
  isOpen,
  setIsOpen,
  order,
}: OrderDetailsModalProps<T>) {
  const getOrderInfoItems = (): InfoSectionItem[] => {
    if (!order) return [];

    return [
      {
        title: 'Order ID',
        value: order.id,
      },
      {
        title: 'Type',
        value: order.subscriptionId ? 'Subscription' : 'Product',
      },
      {
        title: 'Customer',
        value: order.user.name,
      },
      {
        title: 'Email',
        value: order.user.email,
      },
      {
        title: 'Date',
        value: formatDateWithHour(order.createdAt as string),
      },
      {
        title: 'Status',
        value: (
          <span className={`font-semibold ${STATUS_COLOR[order.status]}`}>
            {order.status}
          </span>
        ),
      },
    ];
  };

  const getOrderTableColumns = (): TableSectionColumn[] => {
    return [
      {
        key: 'image',
        title: 'Product',
        type: 'image',
        span: 6,
      },
      {
        key: 'quantity',
        title: 'Quantity',
        type: 'text',
        span: 3,
      },
      {
        key: 'price',
        title: 'Price',
        type: 'text',
        span: 3,
      },
    ];
  };

  const getOrderTableItems = () => {
    if (!order) return [];

    return order.orderItems.map((item) => ({
      id: item.id,
      image: {
        src: generateImgPath(item.cachedProductImages[0], categoryImgParams),
        alt: item.cachedProductTitle as string,
        width: 60,
        height: 60,
        blurDataURL: generateImgPath(
          item.cachedProductImages[0],
          categoryImgBlurParams
        ),
      } as ImageItemConfig,
      quantity: item.quantity,
      price: `$${item.price.toFixed(2)}`,
      title: item.cachedProductTitle,
    }));
  };

  return (
    <CustomModal
      title={`Order Details`}
      open={isOpen}
      onOpenChange={setIsOpen}
      size='xl'
    >
      <div className='space-y-4'>
        {/* Customer Info */}
        <InfoSection
          items={getOrderInfoItems()}
          className='border-b-shop-green-hover border-b'
        />

        {/* Items Table */}
        {getOrderTableItems().length > 0 && (
          <div>
            <h3 className='mb-2 font-semibold'>Items</h3>
            <div className='max-h-[250px] overflow-y-scroll'>
              <ItemsTable
                columns={getOrderTableColumns()}
                items={getOrderTableItems()}
              />
            </div>
          </div>
        )}

        {/* Total */}
        <TotalSection title='Total:' value={order?.totalPrice.toFixed(2)} />
      </div>
    </CustomModal>
  );
}
