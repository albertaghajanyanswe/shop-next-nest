import { reviewService } from '@/services/review.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteReview, isPending: isLoadingDelete } = useMutation({
    mutationKey: QUERY_KEYS.deleteReview,
    mutationFn: (reviewId: string) => reviewService.delete(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.product });
      toast.success('Review deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete review');
    },
  });

  return useMemo(
    () => ({ deleteReview, isLoadingDelete }),
    [deleteReview, isLoadingDelete]
  );
};
