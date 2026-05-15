import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { statisticsService } from '@/services/auth/statistics.service';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type TimeRange = '1w' | '1m' | '6m' | '1y' | 'all';

export const useGetStatistics = () => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1y');

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

  const { data: topProducts, isLoading: isLoadingTopProducts } = useQuery({
    queryKey: [QUERY_KEYS.topProducts, storeId],
    queryFn: () => statisticsService.getTopProducts(storeId, 10),
  });

  const { data: categorySales, isLoading: isLoadingCategorySales } = useQuery({
    queryKey: [QUERY_KEYS.categorySales, storeId],
    queryFn: () => statisticsService.getCategorySales(storeId),
  });

  const { data: salesHistory, isLoading: isLoadingSalesHistory } = useQuery({
    queryKey: [QUERY_KEYS.salesHistory, storeId, selectedRange],
    queryFn: () => statisticsService.getSalesHistory(storeId, selectedRange),
  });

  return useMemo(
    () => ({
      mainStatistics,
      middleStatistics,
      topProducts,
      categorySales,
      salesHistory,
      selectedRange,
      setSelectedRange,
      isLoadingMainStatistics,
      isLoadingMiddleStatistics,
      isLoadingTopProducts,
      isLoadingCategorySales,
      isLoadingSalesHistory,
    }),
    [
      mainStatistics,
      middleStatistics,
      topProducts,
      categorySales,
      salesHistory,
      selectedRange,
      isLoadingMainStatistics,
      isLoadingMiddleStatistics,
      isLoadingTopProducts,
      isLoadingCategorySales,
      isLoadingSalesHistory,
    ]
  );
};
