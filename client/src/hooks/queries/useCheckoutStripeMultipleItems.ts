import { orderService } from '@/services/order.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useMutation } from '@tanstack/react-query';
import { useActions } from './useActions';
import { useRouter } from 'next/navigation';
import { useCart } from './useCart';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { stripeService } from '@/services/stripe.service.ts';

export const useCheckoutStripeMultipleItems = () => {
  const { orderItems } = useCart();
  const { reset } = useActions();
  const router = useRouter();

  const { mutate: createPaymentMultiple, isPending: isLoadingCreateMultiple } =
    useMutation({
      mutationKey: [QUERY_KEYS.payStripe],
      mutationFn: () => {
        return stripeService.pay({
          orderItems: orderItems.map((item) => ({
            quantity: item.quantity,
            price: item.product.price,
            productId: item.product.id as string,
            storeId: item.product.storeId as string,
            name: item.product.title,
            description: item.product.description as string,
            image: item.product.images[0],
            userId: item.product.userId as string,
          })),
        });
      },
      onSuccess: ({ data }) => {
        if (data?.url) {
          window.location.href = data.url;
        }
        router.push(data.url);
        reset();
      },
      onError: (error: any) => {
        toast.error(`${error?.response?.data?.message}`);
      },
    });

  return useMemo(
    () => ({
      createPaymentMultiple,
      isLoadingCreateMultiple,
    }),
    [createPaymentMultiple, isLoadingCreateMultiple]
  );
};
