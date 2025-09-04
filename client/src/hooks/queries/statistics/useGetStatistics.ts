import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { statisticsService } from '@/services/auth/statistics.service';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';

export const useGetStatistics = () => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: mainStatistics, isLoading: isLoadingMainStatistics } = useQuery(
    {
      queryKey: [QUERY_KEYS.mainStatistics, storeId],
      queryFn: () => statisticsService.getMainStatistics(storeId),
    }
  );

  const { data: middleStatistics, isLoading: isLoadingMiddleStatistics } =
    useQuery({
      queryKey: [QUERY_KEYS.middleStatistics, storeId],
      queryFn: () => statisticsService.getMiddleStatistics(storeId),
    });

  return useMemo(
    () => ({
      mainStatistics,
      middleStatistics,
      isLoadingMainStatistics,
      isLoadingMiddleStatistics,
    }),
    [
      mainStatistics,
      middleStatistics,
      isLoadingMainStatistics,
      isLoadingMiddleStatistics,
    ]
  );
};
