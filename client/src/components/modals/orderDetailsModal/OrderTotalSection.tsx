import { Button } from '@/components/ui/Button';
import { GetUserDto } from '@/generated/orval/types';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { memo } from 'react';
import { TotalSection } from './TotalSection';
import { CircleDollarSignIcon } from 'lucide-react';

interface OrderTotalSectionProps {
  title: string;
  value: number | string;
  orderId?: string;
  user: GetUserDto;
}
const OrderTotalSectionComponent = ({
  title,
  value,
  orderId,
  user,
}: OrderTotalSectionProps) => {
  const { distributeFundsOrder, isLoadingDistributeFundsOrder } =
    useDistributeFundsOrder();
  const isShowDistributeBtn = user.role === 'SUPER_ADMIN' && orderId;

  return (
    <div className={`flex w-full flex-row items-center ${isShowDistributeBtn ? 'justify-between': 'justify-end'} border-t pt-4`}>
      {isShowDistributeBtn && (
        <Button
          disabled={isLoadingDistributeFundsOrder}
          onClick={() => distributeFundsOrder(orderId)}
          variant='primary'
        >
          <CircleDollarSignIcon />
          Distribute Funds
        </Button>
      )}
      <TotalSection title={title} value={value} />
    </div>
  );
};

export const OrderTotalSection = memo(OrderTotalSectionComponent);
