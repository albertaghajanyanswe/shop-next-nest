'use client';

import React from 'react';
import { GetOrderWithItemsDto } from '@/generated/orval/types';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { useRefundOrder } from '@/hooks/stripe/useRefundOrder';
import { useDistributeFundsOrderItem } from '@/hooks/stripe/useDistributeFundsOrderItem';
import { useRefundOrderItem } from '@/hooks/stripe/useRefundOrderItem';
import { useAbility } from '@/lib/permissions';
import { AdminOrderHeader } from './AdminOrderHeader';
import { AdminOrderCustomerInfo } from './AdminOrderCustomerInfo';
import { AdminOrderItemsList } from './AdminOrderItemsList';
import { AdminOrderTotalSection } from './AdminOrderTotalSection';

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
  const { can } = useAbility();

  const { distributeFundsOrder, isLoadingDistributeFundsOrder } =
    useDistributeFundsOrder();
  const { refundOrder, isLoadingRefundOrder } = useRefundOrder();
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } =
    useDistributeFundsOrderItem();
  const { refundOrderItem, isLoadingRefundOrderItem } = useRefundOrderItem();

  const isShowRefundBtn = can('refund', 'order') && order.id && showRefund;
  const isShowConfirmBtn = can('confirm', 'order') && order.id && showConfirm;

  return (
    <div className='bg-shop-bg-default overflow-hidden rounded-md border shadow-sm transition-all hover:shadow-md'>
      <AdminOrderHeader
        id={order.id}
        subscriptionId={order.subscriptionId}
        status={order.status}
      />

      <hr className='mx-4 border-neutral-200' />

      <AdminOrderCustomerInfo
        userName={order.user.name}
        userEmail={order.user.email}
        createdAt={order.createdAt as string}
        itemsCount={order.orderItems.length}
      />

      <AdminOrderItemsList
        orderItems={order.orderItems}
        isShowConfirmBtn={isShowConfirmBtn}
        isShowRefundBtn={isShowRefundBtn}
        isLoadingDistributeItem={isLoadingDistributeFundsOrderItem}
        isLoadingRefundItem={isLoadingRefundOrderItem}
        onDistributeItem={distributeFundsOrderItem}
        onRefundItem={refundOrderItem}
      />

      <AdminOrderTotalSection
        orderId={order.id}
        isShowConfirmBtn={isShowConfirmBtn}
        isShowRefundBtn={isShowRefundBtn}
        isLoadingDistribute={isLoadingDistributeFundsOrder}
        isLoadingRefund={isLoadingRefundOrder}
        totalPrice={order.totalPrice}
        onDistribute={distributeFundsOrder}
        onRefund={refundOrder}
      />
    </div>
  );
}
