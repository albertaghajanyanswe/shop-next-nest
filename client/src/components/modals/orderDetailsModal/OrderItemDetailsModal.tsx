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
import { useTranslations } from 'next-intl';

interface OrderItemDetailsModalProps<T extends TableSectionItem> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  orderItem: GetOrderItemsDetailsDto;
  user: GetUserDto;
  showConfirm?: boolean;
  showRefund?: boolean;
}

export function OrderItemDetailsModal<T extends TableSectionItem>({
  isOpen,
  setIsOpen,
  orderItem,
  user,
  showConfirm = false,
  showRefund = false,
}: OrderItemDetailsModalProps<T>) {
  const t = useTranslations('Modals');

  const getOrderInfoItems = (): InfoSectionItem[] => {
    if (!orderItem) return [];

    return [
      {
        title: t('order_item_info_id'),
        value: orderItem.id,
      },
      {
        title: t('order_info_customer'),
        value: orderItem.order.user.name,
      },
      {
        title: t('order_info_email'),
        value: orderItem.order.user.email,
      },
      {
        title: t('order_info_date'),
        value: formatDateWithHour(orderItem.createdAt as string),
      },
      {
        title: t('order_info_status'),
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
        title: t('order_col_product'),
        type: 'image',
        span: 'col-span-6',
      },
      {
        key: 'quantity',
        title: t('order_col_quantity'),
        type: 'text',
        span: 'col-span-3',
      },
      {
        key: 'price',
        title: t('order_col_price'),
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
      title={t('order_item_details_title')}
      open={isOpen}
      onOpenChange={setIsOpen}
      size='xl'
    >
      <div className='xs:max-w-none max-w-fit space-y-4'>
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
              showRefund={showRefund}
            />
          </div>
        </div>

        {/* Total */}
        <OrderItemTotalSection
          title={t('order_total')}
          value={formatPrice(orderItem.price * orderItem.quantity)}
          user={user}
          orderItemId={orderItem.id}
          showConfirm={showConfirm}
          showRefund={showRefund}
          orderItemStatus={orderItem.status}
        />
      </div>
    </CustomModal>
  );
}
