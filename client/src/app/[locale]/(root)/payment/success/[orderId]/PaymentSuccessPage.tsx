'use client';
import { useTranslations } from 'next-intl';
import Loading from '@/components/customComponents/loading/Loading';
import { OrderDetailsModalContent } from '@/components/modals/orderDetailsModal/OrderDetailsModalContent';
import { useGetOrderById } from '@/hooks/queries/orders/useGetOrderById';
import { memo } from 'react';

interface PaymentSuccessPageProps {
  orderId: string;
}

function PaymentSuccessPage({ orderId }: PaymentSuccessPageProps) {
  const t = useTranslations('PaymentSuccess');
  const { order, isLoadingOrder } = useGetOrderById(orderId);

  return order && !isLoadingOrder ? (
    <div className='my-6 flex flex-col items-center justify-center gap-4 rounded-md py-6'>
      <h1 className='text-primary text-2xl font-semibold'>{t('title')}</h1>
      <div className='border-shop-bg-2 bg-shop-white rounded-md border p-4'>
        <OrderDetailsModalContent order={order!} />
      </div>
    </div>
  ) : (
    <Loading text={t('loading')} />
  );
}
export default memo(PaymentSuccessPage);
