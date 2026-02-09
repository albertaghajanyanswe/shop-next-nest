'use client';
import React from 'react';
import { CustomModal } from '@/components/modals/CustomModal';
import { InfoSection } from './components/InfoSection';
import { ItemsTable } from './components/ItemsTable';
import {
  GetOrderDtoStatus,
  GetOrderWithItemsDto,
  GetUserDto,
} from '@/generated/orval/types';
import { formatDateWithHour } from '@/utils/formateDate';
import { STATUS_COLOR } from '@/utils/colorUtils';
import {
  categoryImgBlurParams,
  categoryImgParams,
  generateImgPath,
} from '@/utils/imageUtils';
import { OrderTotalSection } from './components/OrderTotalSection';
import { formatPrice } from '@/utils/formatPrice';
import { useProfile } from '@/hooks/useProfile';

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
  span?: string;
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
  order: GetOrderWithItemsDto;
  showConfirm?: boolean;
}

export function OrderDetailsModalContent<T extends TableSectionItem>({
  order,
  showConfirm = false,
}: OrderDetailsModalProps<T>) {
  const { user } = useProfile();
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
        span: 'col-span-5',
      },
      {
        key: 'userEmail',
        title: 'User',
        type: 'text',
        span: 'col-span-3',
      },
      {
        key: 'quantity',
        title: 'Quantity',
        type: 'text',
        span: 'col-span-2',
      },
      {
        key: 'price',
        title: 'Price',
        type: 'text',
        span: 'col-span-2',
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
      userEmail: item.user.email,
      orderItemId: item.id,
      orderItemStatus: item.status,
      productId: item.productId,
      storeId: item.storeId,
    }));
  };

  return (
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
              user={user!}
              showConfirm={showConfirm}
            />
          </div>
        </div>
      )}

      {/* Total */}
      <OrderTotalSection
        title='Total'
        value={formatPrice(order?.totalPrice)}
        orderId={order.id}
        user={user!}
        showConfirm={showConfirm}
      />
    </div>
  );
}
