import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { stripeService } from '@/services/stripe.service.ts';

export function useCancelUpgrade() {
  const queryClient = useQueryClient();

  const { mutate: cancelUpgrade, isPending: isLoadingCancel } = useMutation({
    mutationKey: QUERY_KEYS.cancelUpgrade,
    mutationFn: () => stripeService.cancelUpgrade(),
    onSuccess: (cancelRes) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getSubscriptions });
      if (cancelRes?.url) {
        window.location.href = cancelRes.url;
      }
    },
    onError: () => {
      toast.error('Failed to cancel upgrade plan.');
    },
  });

  return useMemo(
    () => ({ cancelUpgrade, isLoadingCancel }),
    [cancelUpgrade, isLoadingCancel]
  );
}
