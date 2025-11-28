import { colorService } from '@/services/color.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetColors = (queryParams?: iFilterParams) => {
  const { data: colorsData, isLoading: isLoadingColorsData } = useQuery({
    queryKey: [QUERY_KEYS.getStoreColors, queryParams?.params],
    queryFn: () => colorService.getAll(queryParams?.params),
  });

  return useMemo(
    () => ({
      colorsData,
      isLoadingColorsData,
    }),
    [colorsData, isLoadingColorsData]
  );
};
