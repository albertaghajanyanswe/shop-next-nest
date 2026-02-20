import { Button } from '@/components/ui/Button';
import { GetUserDto } from '@/generated/orval/types';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { memo } from 'react';
import { TotalSection } from './TotalSection';
import { useDistributeFundsOrderItem } from '@/hooks/stripe/useDistributeFundsOrderItem';
import { useRefundOrderItem } from '@/hooks/stripe/useRefundOrderItem';

interface OrderItemTotalSectionProps {
  title: string;
  value: number | string;
  orderItemId?: string;
  user: GetUserDto;
  showConfirm?: boolean;
  showRefund?: boolean;
}
const OrderItemTotalSectionComponent = ({
  title,
  value,
  orderItemId,
  user,
  showConfirm,
  showRefund,
}: OrderItemTotalSectionProps) => {
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } =
    useDistributeFundsOrderItem();
  const { refundOrderItem, isLoadingRefundOrderItem } = useRefundOrderItem();
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
      </div>
      <TotalSection title={title} value={value} />
    </div>
  );
};

export const OrderItemTotalSection = memo(OrderItemTotalSectionComponent);
