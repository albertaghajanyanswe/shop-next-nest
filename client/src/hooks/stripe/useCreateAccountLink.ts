import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { stripeService } from '@/services/stripe.service.ts';

export function useCreateAccountLink() {
  const { mutate: createAccountLink, isPending: isLoadingCreateAccountLink } =
    useMutation({
      mutationKey: QUERY_KEYS.connectAccount,
      mutationFn: (email: string) =>
        stripeService.createStripeAccountLink(email),
      onSuccess: (createLinkRes) => {
        if (createLinkRes?.url) {
          window.location.href = createLinkRes.url;
        }
      },
      onError: () => {
        toast.error('Failed to create account link on stripe.');
      },
    });

  return useMemo(
    () => ({ createAccountLink, isLoadingCreateAccountLink }),
    [createAccountLink, isLoadingCreateAccountLink]
  );
}
