import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/constants';
import { stripeService } from '@/services/stripe.service.ts';

export function useUpgradePlan() {
  const queryClient = useQueryClient();

  const { mutate: upgradePlan, isPending: isLoadingUpgrade } = useMutation({
    mutationKey: QUERY_KEYS.upgradePlan,
    mutationFn: (planId: string) => stripeService.upgradePlan(planId),
    onSuccess: (upgradeRes) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getSubscriptions });
      if (upgradeRes?.url) {
        window.location.href = upgradeRes.url;
      }
    },
    onError: () => {
      toast.error('Failed to upgrade plan.');
    },
  });

  return useMemo(
    () => ({ upgradePlan, isLoadingUpgrade }),
    [upgradePlan, isLoadingUpgrade]
  );
}
