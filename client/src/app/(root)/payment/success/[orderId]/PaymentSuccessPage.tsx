'use client';
import Loading from '@/components/customComponents/loading/Loading';
import { OrderDetailsModalContent } from '@/components/modals/orderDetailsModal/OrderDetailsModalContent';
import { useGetOrderById } from '@/hooks/queries/orders/useGetOrderById';
import { memo } from 'react';

interface PaymentSuccessPageProps {
  orderId: string;
}

function PaymentSuccessPage({ orderId }: PaymentSuccessPageProps) {
  const { order, isLoadingOrder } = useGetOrderById(orderId);

  return order && !isLoadingOrder ? (
    <div className='bg-shop-light-bg my-6 flex flex-col items-center justify-center gap-4 rounded-md py-6'>
      <h1 className='text-primary text-2xl font-semibold'>Payment Success</h1>
      <div className='border-shop-bg rounded-md border bg-white p-4'>
        <OrderDetailsModalContent order={order!} />
      </div>
    </div>
  ) : (
    <Loading text='Loading your order details...' />
  );
}
export default memo(PaymentSuccessPage);
