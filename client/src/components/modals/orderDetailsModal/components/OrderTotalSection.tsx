import { Button } from '@/components/ui/Button';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { memo } from 'react';
import { TotalSection } from './TotalSection';
import { CircleDollarSignIcon, RotateCcw } from 'lucide-react';
import { useRefundOrder } from '@/hooks/stripe/useRefundOrder';
import { useTranslations } from 'next-intl';
import { can as checkAbility } from '@/lib/permissions';
import type { UserIdentity } from '@/lib/permissions';

interface OrderTotalSectionProps {
  title: string;
  value: number | string;
  orderId?: string;
  user: UserIdentity;
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
  const isShowRefundBtn =
    checkAbility(user, 'refund', 'order') && orderId && showRefund;
  const isShowConfirmBtn =
    checkAbility(user, 'confirm', 'order') && orderId && showConfirm;

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
            {showConfirm
              ? dashT('order_btn_confirm')
              : dashT('order_btn_distribute_funds')}
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
