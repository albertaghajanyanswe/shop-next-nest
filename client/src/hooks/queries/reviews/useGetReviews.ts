import { reviewService } from '@/services/review.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetReviews = (queryParams?: iFilterParams) => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: reviewsData, isLoading: isLoadingReviewsData } = useQuery({
    queryKey: [QUERY_KEYS.getStoreReviews, storeId, queryParams?.params],
    queryFn: () => reviewService.getByStoreId(storeId, queryParams?.params),
  });

  return useMemo(
    () => ({ reviewsData, isLoadingReviewsData }),
    [reviewsData, isLoadingReviewsData]
  );
};
