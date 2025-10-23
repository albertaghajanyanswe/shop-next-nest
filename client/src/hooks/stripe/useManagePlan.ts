import { stripeService } from '@/services/stripe.service.ts';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useManagePlan = () => {
  const { data: managePlan, isLoading: isLoadingManagePlan } = useQuery(
    {
      queryKey: [QUERY_KEYS.getManagementLink],
      queryFn: () => stripeService.getManagementLink(),
    }
  );

  return useMemo(
    () => ({
      managePlan,
      isLoadingManagePlan,
    }),
    [managePlan, isLoadingManagePlan]
  );
};
