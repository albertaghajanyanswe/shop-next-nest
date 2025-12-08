import React from 'react';
import { CustomModal } from '@/components/modals/CustomModal';
import { InfoSection } from './InfoSection';
import { ItemsTable } from './ItemsTable';
import {
  GetOrderItemsDetailsDto,
  GetOrderWithItemsDto,
} from '@/generated/orval/types';
import { formatDateWithHour } from '@/utils/formateDate';
import { STATUS_COLOR } from '@/utils/colorUtils';
import {
  categoryImgBlurParams,
  categoryImgParams,
  generateImgPath,
} from '@/utils/imageUtils';
import {
  ImageItemConfig,
  InfoSectionItem,
  TableSectionColumn,
  TableSectionItem,
} from './OrderDetailsModal';
import { TotalSection } from './TotalSection';

interface OrderItemDetailsModalProps<T extends TableSectionItem> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  orderItem: GetOrderItemsDetailsDto;
}

export function OrderItemDetailsModal<T extends TableSectionItem>({
  isOpen,
  setIsOpen,
  orderItem,
}: OrderItemDetailsModalProps<T>) {
  const getOrderInfoItems = (): InfoSectionItem[] => {
    if (!orderItem) return [];

    return [
      {
        title: 'Order item ID',
        value: orderItem.id,
      },
      {
        title: 'Customer',
        value: orderItem.order.user.name,
      },
      {
        title: 'Email',
        value: orderItem.order.user.email,
      },
      {
        title: 'Date',
        value: formatDateWithHour(orderItem.createdAt as string),
      },
      {
        title: 'Status',
        value: (
          <span
            className={`font-semibold ${STATUS_COLOR[orderItem.order.status]}`}
          >
            {orderItem.order.status}
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
    if (!orderItem) return [];

    return [
      {
        id: orderItem.id,
        image: {
          src: generateImgPath(
            orderItem.cachedProductImages[0],
            categoryImgParams
          ),
          alt: orderItem.cachedProductTitle as string,
          width: 60,
          height: 60,
          blurDataURL: generateImgPath(
            orderItem.cachedProductImages[0],
            categoryImgBlurParams
          ),
        } as ImageItemConfig,
        quantity: orderItem.quantity,
        price: `$${orderItem.price.toFixed(2)}`,
        title: orderItem.cachedProductTitle,
      },
    ];
  };

  return (
    <CustomModal
      title={`Order Item Details`}
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
        <div>
          <div className='max-h-[250px] overflow-y-scroll'>
            <ItemsTable
              columns={getOrderTableColumns()}
              items={getOrderTableItems()}
            />
          </div>
        </div>

        {/* Total */}
        <TotalSection
          title='Total:'
          value={orderItem.price * orderItem.quantity}
        />
      </div>
    </CustomModal>
  );
}
