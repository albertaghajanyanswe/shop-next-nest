import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { stripeService } from '@/services/stripe.service.ts';

export function useDistributeFundsOrder() {
  const queryClient = useQueryClient();

  const {
    mutate: distributeFundsOrder,
    isPending: isLoadingDistributeFundsOrder,
  } = useMutation({
    mutationKey: QUERY_KEYS.distributeFundsOrder,
    mutationFn: (orderId: string) =>
      stripeService.distributeFundsOrder(orderId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getAllOrders[0]],
        exact: false,
      });
      console.log('result = ', result);
    },
    onError: (error) => {
      console.log('ERR = ', error);
      toast.error(
        error?.response?.data?.message ||
          'Failed to distribute funds for order on stripe.'
      );
    },
  });

  return useMemo(
    () => ({ distributeFundsOrder, isLoadingDistributeFundsOrder }),
    [distributeFundsOrder, isLoadingDistributeFundsOrder]
  );
}
