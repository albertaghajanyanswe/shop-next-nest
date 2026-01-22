import { orderService } from '@/services/order.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useMutation } from '@tanstack/react-query';
import { useActions } from './useActions';
import { useRouter } from 'next/navigation';
import { useCart } from './useCart';
import toast from 'react-hot-toast';
import { useMemo } from 'react';

export const useCheckout = () => {
  const { orderItems } = useCart();
  const { reset } = useActions();
  const router = useRouter();

  const { mutate: createPayment, isPending: isLoadingCreate } = useMutation({
    mutationKey: [QUERY_KEYS.checkout],
    mutationFn: () => {
      return orderService.place({
        orderItems: orderItems.map((item) => ({
          quantity: item.quantity,
          price: item.product.price,
          productId: item.product.id,
          storeId: item.product.storeId,
          name: item.product.title,
          description: item.product.description,
          image: item.product.images[0],
          userId: item.product.userId,
        })),
      });
    },
    onSuccess: ({ data }) => {
      router.push(data.confirmation.confirmation_url);
      reset();
    },
    onError: (error) => {
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
