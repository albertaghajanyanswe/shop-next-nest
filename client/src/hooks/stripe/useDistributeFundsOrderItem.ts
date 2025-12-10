import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { stripeService } from '@/services/stripe.service.ts';

export function useDistributeFundsOrderItem() {
  const queryClient = useQueryClient();

  const {
    mutate: distributeFundsOrderItem,
    isPending: isLoadingDistributeFundsOrderItem,
  } = useMutation({
    mutationKey: QUERY_KEYS.distributeFundsOrderItem,
    mutationFn: (orderItemId: string) =>
      stripeService.distributeFundsOrderItem(orderItemId),
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
    () => ({ distributeFundsOrderItem, isLoadingDistributeFundsOrderItem }),
    [distributeFundsOrderItem, isLoadingDistributeFundsOrderItem]
  );
}
