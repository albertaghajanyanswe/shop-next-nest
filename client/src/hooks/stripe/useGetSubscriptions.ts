import { stripeService } from '@/services/stripe.service.ts';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useGetSubscriptions = () => {
  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: [QUERY_KEYS.getSubscriptions],
    queryFn: () => stripeService.getSubscriptions(),
  });

  return useMemo(
    () => ({
      subscriptions,
      isLoadingSubscriptions,
    }),
    [subscriptions, isLoadingSubscriptions]
  );
};
