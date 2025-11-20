import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { stripeService } from '@/services/stripe.service.ts';

export function useTestClock() {
  const { mutate: runTestClock, isPending: isLoadingTestClock } = useMutation({
    mutationKey: QUERY_KEYS.testClock,
    mutationFn: (numberOfDays: number) =>
      stripeService.simulateStripeTestClockAdvance(numberOfDays),
    onSuccess: () => {
      console.log('Test clock success');
    },
    onError: (err) => {
      console.log('Failed to run test clock advance. ', err);
      toast.error(
        `Failed to run test clock advance. ${err?.response?.data?.message}`
      );
    },
  });

  return useMemo(
    () => ({ runTestClock, isLoadingTestClock }),
    [runTestClock, isLoadingTestClock]
  );
}
