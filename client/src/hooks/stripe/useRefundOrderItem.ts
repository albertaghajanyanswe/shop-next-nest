import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { stripeService } from '@/services/stripe.service.ts';

export function useRefundOrderItem() {
  const queryClient = useQueryClient();

  const { mutate: refundOrderItem, isPending: isLoadingRefundOrderItem } =
    useMutation({
      mutationKey: QUERY_KEYS.refundOrderItem,
      mutationFn: (orderItemId: string, reason?: string) =>
        stripeService.refundOrderItem(orderItemId, reason),
      onSuccess: (result) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.getAllOrders[0]],
          exact: false,
        });
      },
      onError: (error: any) => {
        console.log('ERR = ', error);
        toast.error(
          error?.response?.data?.message ||
            'Failed to refund order item on stripe.'
        );
      },
    });

  return useMemo(
    () => ({ refundOrderItem, isLoadingRefundOrderItem }),
    [refundOrderItem, isLoadingRefundOrderItem]
  );
}
