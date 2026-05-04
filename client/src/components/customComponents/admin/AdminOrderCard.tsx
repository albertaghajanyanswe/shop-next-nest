'use client';

import React from 'react';
import { GetOrderWithItemsDto } from '@/generated/orval/types';
import { OrderDetailsModalContent } from '../../modals/orderDetailsModal/OrderDetailsModalContent';

interface AdminOrderCardProps {
  order: GetOrderWithItemsDto;
  showConfirm?: boolean;
  showRefund?: boolean;
}

export function AdminOrderCard({
  order,
  showConfirm = false,
  showRefund = false,
}: AdminOrderCardProps) {
  return (
    <div className='rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md'>
      <OrderDetailsModalContent
        order={order}
        showConfirm={showConfirm}
        showRefund={showRefund}
      />
    </div>
  );
}
