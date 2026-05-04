'use client';

import React from 'react';
import { GetOrderItemsDetailsDto, GetUserDto } from '@/generated/orval/types';
import { OrderItemDetailsModalContent } from '../../modals/orderDetailsModal/OrderItemDetailsModalContent';

interface AdminOrderItemCardProps {
  orderItem: GetOrderItemsDetailsDto;
  user: GetUserDto;
  showConfirm?: boolean;
  showRefund?: boolean;
}

export function AdminOrderItemCard({
  orderItem,
  user,
  showConfirm = false,
  showRefund = false,
}: AdminOrderItemCardProps) {
  return (
    <div className='rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md'>
      <OrderItemDetailsModalContent
        orderItem={orderItem}
        user={user}
        showConfirm={showConfirm}
        showRefund={showRefund}
      />
    </div>
  );
}
