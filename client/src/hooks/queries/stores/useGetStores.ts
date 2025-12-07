import { storeService } from '@/services/store.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useGetStores = (queryParams?: iFilterParams) => {
  const { data: storesData, isLoading: isLoadingStoresData } = useQuery({
    queryKey: [QUERY_KEYS.getAllStores, queryParams?.params],
    queryFn: () => storeService.getAll(queryParams?.params),
  });

  return useMemo(
    () => ({
      storesData,
      isLoadingStoresData,
    }),
    [storesData, isLoadingStoresData]
  );
};
