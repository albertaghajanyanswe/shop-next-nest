import { planService } from '@/services/plan.service';
import { stripeService } from '@/services/stripe.service.ts';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useGetPlans = () => {
  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: [QUERY_KEYS.getPlans],
    queryFn: () => planService.getPlans(),
  });

  return useMemo(
    () => ({
      plans,
      isLoadingPlans,
    }),
    [plans, isLoadingPlans]
  );
};
