import { Button } from '@/components/ui/Button';
import {
  GetOrderItemsDetailsDtoStatus,
  GetUserDto,
} from '@/generated/orval/types';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { memo } from 'react';
import { TotalSection } from './TotalSection';
import { useDistributeFundsOrderItem } from '@/hooks/stripe/useDistributeFundsOrderItem';
import { useRefundOrderItem } from '@/hooks/stripe/useRefundOrderItem';
import { useUpdateOrderItem } from '@/hooks/queries/orders/useUpdateOrderItem';

interface OrderItemTotalSectionProps {
  title: string;
  value: number | string;
  orderItemId?: string;
  user: GetUserDto;
  showConfirm?: boolean;
  showRefund?: boolean;
  orderItemStatus?: GetOrderItemsDetailsDtoStatus;
}
const OrderItemTotalSectionComponent = ({
  title,
  value,
  orderItemId,
  user,
  showConfirm,
  showRefund,
  orderItemStatus,
}: OrderItemTotalSectionProps) => {
  console.log('orderItemStatus = ', orderItemStatus);
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } =
    useDistributeFundsOrderItem();
  const { refundOrderItem, isLoadingRefundOrderItem } = useRefundOrderItem();

  const { updateOrderItem, isLoadingUpdate } = useUpdateOrderItem();
  const nextStatus =
    orderItemStatus === GetOrderItemsDetailsDtoStatus.PENDING
      ? { status: GetOrderItemsDetailsDtoStatus.CANCELLED }
      : { status: GetOrderItemsDetailsDtoStatus.PENDING };
  const isShowDistributeBtn = showConfirm && orderItemId;
  const isShowRefundBtn = showRefund && orderItemId;
  return (
    <div
      className={`flex w-full flex-row items-center ${isShowDistributeBtn ? 'justify-between' : 'justify-end'} border-t pt-4`}
    >
      <div className={`flex flex-row gap-2`}>
        {isShowDistributeBtn && (
          <Button
            disabled={isLoadingDistributeFundsOrderItem}
            onClick={() => distributeFundsOrderItem(orderItemId)}
            variant='default'
          >
            Confirm
          </Button>
        )}
        {isShowRefundBtn && (
          <Button
            disabled={isLoadingRefundOrderItem}
            onClick={() => refundOrderItem(orderItemId)}
            variant='outline'
          >
            Refund
          </Button>
        )}
        {/* {orderItemStatus && (
          <Button
            disabled={isLoadingRefundOrderItem}
            onClick={() =>
              updateOrderItem({ id: orderItemId, data: nextStatus })
            }
            variant='outline'
          >
            Update Status to {nextStatus.status}
          </Button>
        )} */}
      </div>
      <TotalSection title={title} value={value} />
    </div>
  );
};

export const OrderItemTotalSection = memo(OrderItemTotalSectionComponent);
