import React from 'react';
import { CustomModal } from '@/components/modals/CustomModal';
import { GetOrderWithItemsDto } from '@/generated/orval/types';
import { OrderDetailsModalContent } from './OrderDetailsModalContent';

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
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  order: GetOrderWithItemsDto;
  showConfirm: boolean;
}

export function OrderDetailsModal<T extends TableSectionItem>({
  isOpen,
  setIsOpen,
  order,
  showConfirm = false,
}: OrderDetailsModalProps<T>) {
  return (
    <CustomModal
      title={`Order Details`}
      open={isOpen}
      onOpenChange={setIsOpen}
      size='xl'
    >
      <OrderDetailsModalContent order={order} showConfirm={showConfirm} />
    </CustomModal>
  );
}
