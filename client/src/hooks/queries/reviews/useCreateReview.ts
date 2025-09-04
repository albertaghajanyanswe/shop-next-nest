import { reviewService } from '@/services/review.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IReviewInput } from '@/shared/types/review.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export const useCreateReview = (storeId: string) => {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { mutate: createReview, isPending: isLoadingCreate } = useMutation({
    mutationKey: QUERY_KEYS.createReview,
    mutationFn: (data: IReviewInput) => reviewService.create(data, params.id, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.productId(params.id) });
      toast.success('Review created successfully');
    },
    onError: () => {
      toast.error('Failed to create review');
    },
  });

  return useMemo(
    () => ({ createReview, isLoadingCreate }),
    [createReview, isLoadingCreate]
  );
};
