import React from 'react';
import { CustomModal } from '@/components/modals/CustomModal';
import { GetOrderItemsDetailsDto, GetUserDto } from '@/generated/orval/types';
import { TableSectionItem } from './OrderDetailsModal';
import { useTranslations } from 'next-intl';
import { OrderItemDetailsModalContent } from './OrderItemDetailsModalContent';

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

  return (
    <CustomModal
      title={t('order_item_details_title')}
      open={isOpen}
      onOpenChange={setIsOpen}
      size='xl'
    >
      <OrderItemDetailsModalContent
        orderItem={orderItem}
        user={user}
        showConfirm={showConfirm}
        showRefund={showRefund}
      />
    </CustomModal>
  );
}

