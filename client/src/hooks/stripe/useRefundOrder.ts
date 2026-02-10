import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { stripeService } from '@/services/stripe.service.ts';

export function useRefundOrder() {
  const queryClient = useQueryClient();

  const { mutate: refundOrder, isPending: isLoadingRefundOrder } = useMutation({
    mutationKey: QUERY_KEYS.refundOrder,
    mutationFn: (orderId: string, reason?: string) =>
      stripeService.refundOrder(orderId, reason),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getAllOrders[0]],
        exact: false,
      });
      console.log('result = ', result);
    },
    onError: (error: any) => {
      console.log('ERR = ', error);
      toast.error(
        error?.response?.data?.message || 'Failed to refund order on stripe.'
      );
    },
  });

  return useMemo(
    () => ({ refundOrder, isLoadingRefundOrder }),
    [refundOrder, isLoadingRefundOrder]
  );
}
