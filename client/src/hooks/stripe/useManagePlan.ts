import { stripeService } from '@/services/stripe.service.ts';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useManagePlan = () => {
  const { data: managePlan, isLoading: isLoadingManagePlan } = useQuery({
    queryKey: [QUERY_KEYS.getManagementLink],
    queryFn: () => stripeService.getManagementLink(),
    onSuccess: () => {
      toast.success('Login success');
      router.replace(DASHBOARD_URL.home());
      form.reset();
    },
  });

  return useMemo(
    () => ({
      managePlan,
      isLoadingManagePlan,
    }),
    [managePlan, isLoadingManagePlan]
  );
};
