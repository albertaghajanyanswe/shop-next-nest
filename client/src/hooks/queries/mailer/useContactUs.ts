import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { ContactUsDto } from '@/generated/orval/types';
import { mailerService } from '@/services/mailer.service';

export const useContactUs = () => {
  const { mutate: sendContactUs, isPending: isLoadingContactUs } = useMutation({
    mutationKey: QUERY_KEYS.contactUs,
    mutationFn: (data: ContactUsDto) => mailerService.contactUs(data),
    onSuccess: () => {
      toast.success('Email successfully sent.');
    },
    onError: () => {
      toast.error('Failed to send email.');
    },
  });

  return useMemo(
    () => ({ sendContactUs, isLoadingContactUs }),
    [sendContactUs, isLoadingContactUs]
  );
};
