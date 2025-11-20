import { orderService } from '@/services/order.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useMutation } from '@tanstack/react-query';
import { useActions } from './useActions';
import { useRouter } from 'next/navigation';
import { useCart } from './useCart';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { stripeService } from '@/services/stripe.service.ts';
import { ICartItem } from '@/shared/types/cart.interface';

export const useCheckoutStripe = () => {
  const { orderItems } = useCart();
  const { reset } = useActions();
  const router = useRouter();

  const { mutate: createPayment, isPending: isLoadingCreate } = useMutation({
    mutationKey: [QUERY_KEYS.payStripe],
    mutationFn: (orderItem: ICartItem) => {
      return stripeService.pay({
        orderItems: [
          {
            quantity: orderItem.quantity,
            price: orderItem.product.price,
            productId: orderItem.product.id,
            storeId: orderItem.product.storeId,
            name: orderItem.product.title,
            description: orderItem.product.description,
            image: orderItem.product.images[0],
            userId: orderItem.product.userId,
          },
        ],
      });
    },
    onSuccess: ({ data }) => {
      if (data?.url) {
        window.location.href = data.url;
      }
      router.push(data.url);
      reset();
    },
    onError: (error) => {
      console.log('error ', error);
      toast.error('Checkout failed');
    },
  });

  return useMemo(
    () => ({
      createPayment,
      isLoadingCreate,
    }),
    [createPayment, isLoadingCreate]
  );
};
