import { Button } from '@/components/ui/Button';
import { GetUserDto } from '@/generated/orval/types';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { memo } from 'react';
import { TotalSection } from './TotalSection';
import { useDistributeFundsOrderItem } from '@/hooks/stripe/useDistributeFundsOrderItem';

interface OrderItemTotalSectionProps {
  title: string;
  value: number | string;
  orderItemId?: string;
  user: GetUserDto;
  showConfirm?: boolean;
}
const OrderItemTotalSectionComponent = ({
  title,
  value,
  orderItemId,
  user,
  showConfirm,
}: OrderItemTotalSectionProps) => {
  const { distributeFundsOrderItem, isLoadingDistributeFundsOrderItem } =
    useDistributeFundsOrderItem();
  const isShowDistributeBtn = showConfirm && orderItemId;
  return (
    <div
      className={`flex w-full flex-row items-center ${isShowDistributeBtn ? 'justify-between' : 'justify-end'} border-t pt-4`}
    >
      {isShowDistributeBtn && (
        <Button
          disabled={isLoadingDistributeFundsOrderItem}
          onClick={() => distributeFundsOrderItem(orderItemId)}
          variant='primary'
        >
          {showConfirm ? 'Confirm' : 'Distribute Funds'}
        </Button>
      )}
      <TotalSection title={title} value={value} />
    </div>
  );
};

export const OrderItemTotalSection = memo(OrderItemTotalSectionComponent);
