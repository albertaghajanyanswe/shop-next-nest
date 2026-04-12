import { Button } from '@/components/ui/Button';
import { GetUserDto } from '@/generated/orval/types';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { memo } from 'react';
import { TotalSection } from './TotalSection';
import { CircleDollarSignIcon, RotateCcw } from 'lucide-react';
import { useRefundOrder } from '@/hooks/stripe/useRefundOrder';
import { useTranslations } from 'next-intl';

interface OrderTotalSectionProps {
  title: string;
  value: number | string;
  orderId?: string;
  user: GetUserDto;
  showConfirm?: boolean;
  showRefund?: boolean;
}
const OrderTotalSectionComponent = ({
  title,
  value,
  orderId,
  user,
  showConfirm = false,
  showRefund = false,
}: OrderTotalSectionProps) => {
  const { distributeFundsOrder, isLoadingDistributeFundsOrder } =
    useDistributeFundsOrder();

  const { refundOrder, isLoadingRefundOrder } = useRefundOrder();
  const dashT = useTranslations('Modals');
  const isShowRefundBtn = user?.role === 'SUPER_ADMIN' && orderId && showRefund;
  const isShowConfirmBtn =
    user?.role === 'SUPER_ADMIN' && orderId && showConfirm;

  return (
    <div
      className={`flex w-full flex-row items-center ${isShowConfirmBtn || isShowRefundBtn ? 'justify-between' : 'justify-end'} border-t pt-4`}
    >
      <div className='flex flex-row gap-1'>
        {isShowConfirmBtn && (
          <Button
            disabled={isLoadingDistributeFundsOrder}
            onClick={() => distributeFundsOrder(orderId)}
            variant='default'
            className='text-xs'
          >
            <CircleDollarSignIcon />
            {showConfirm ? dashT('order_btn_confirm') : dashT('order_btn_distribute_funds')}
          </Button>
        )}
        {isShowRefundBtn && (
          <Button
            disabled={isLoadingRefundOrder}
            onClick={() => refundOrder(orderId!)}
            variant='outline'
            className='text-xs'
          >
            <RotateCcw />
            {dashT('order_btn_refund_order')}
          </Button>
        )}
      </div>
      <TotalSection title={title} value={value} />
    </div>
  );
};

export const OrderTotalSection = memo(OrderTotalSectionComponent);
