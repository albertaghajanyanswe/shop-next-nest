import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { stripeService } from '@/services/stripe.service.ts';

export function useCreateConnectAccountStripe() {
  const { mutate: connectStripeAccount, isPending: isLoadingConnectAccount } =
    useMutation({
      mutationKey: QUERY_KEYS.connectAccount,
      mutationFn: () => stripeService.createConnectAccountStripe(),
      onSuccess: (connectRes) => {
        console.log('connectRes = ', connectRes);
        if (connectRes?.accountLink) {
          window.location.href = connectRes.accountLink;
        }
      },
      onError: () => {
        toast.error('Failed to create connect account on stripe.');
      },
    });

  return useMemo(
    () => ({ connectStripeAccount, isLoadingConnectAccount }),
    [connectStripeAccount, isLoadingConnectAccount]
  );
}
