import React from 'react';
import { CustomModal } from '@/components/modals/CustomModal';
import { InfoSection } from './components/InfoSection';
import { ItemsTable } from './components/ItemsTable';
import { GetOrderItemsDetailsDto, GetUserDto } from '@/generated/orval/types';
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
import { OrderItemTotalSection } from './components/OrderItemTotalSection';
import { formatPrice } from '@/utils/formatPrice';

interface OrderItemDetailsModalProps<T extends TableSectionItem> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  orderItem: GetOrderItemsDetailsDto;
  user: GetUserDto;
  showConfirm?: boolean;
}

export function OrderItemDetailsModal<T extends TableSectionItem>({
  isOpen,
  setIsOpen,
  orderItem,
  user,
  showConfirm = false,
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
        span: 'col-span-6',
      },
      {
        key: 'quantity',
        title: 'Quantity',
        type: 'text',
        span: 'col-span-3',
      },
      {
        key: 'price',
        title: 'Price',
        type: 'text',
        span: 'col-span-3',
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
        productId: orderItem.productId,
        orderItemId: orderItem.id,
        storeId: orderItem.storeId,
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
              user={user}
              showConfirm={showConfirm}
            />
          </div>
        </div>

        {/* Total */}
        <OrderItemTotalSection
          title='Total'
          value={formatPrice(orderItem.price * orderItem.quantity)}
          user={user}
          orderItemId={orderItem.id}
          showConfirm={showConfirm}
        />
      </div>
    </CustomModal>
  );
}
