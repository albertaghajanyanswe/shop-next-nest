import { stripeService } from '@/services/stripe.service.ts';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useCreateLoginLink = () => {
  const { data: stripeLoginUrl, isLoading: isLoadingStripeLoginUrl } = useQuery(
    {
      queryKey: [QUERY_KEYS.createLoginLink],
      queryFn: () => stripeService.getLoginUrl(),
    }
  );

  return useMemo(
    () => ({
      stripeLoginUrl,
      isLoadingStripeLoginUrl,
    }),
    [stripeLoginUrl, isLoadingStripeLoginUrl]
  );
};
