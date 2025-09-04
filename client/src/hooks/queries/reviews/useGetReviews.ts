import { reviewService } from '@/services/review.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetReviews = () => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: [QUERY_KEYS.getStoreReviews, storeId],
    queryFn: () => reviewService.getByStoreId(storeId),
  });

  return useMemo(
    () => ({ reviews, isLoadingReviews }),
    [reviews, isLoadingReviews]
  );
};
