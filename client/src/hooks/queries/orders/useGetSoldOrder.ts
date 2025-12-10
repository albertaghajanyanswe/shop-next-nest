import { orderService } from '@/services/order.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useGetSoldOrders = (queryParams?: iFilterParams) => {
  const { data: soldOrdersData, isLoading: isLoadingSoldOrdersData } = useQuery(
    {
      queryKey: [QUERY_KEYS.getSoldOrders[0], queryParams?.params],
      queryFn: () => orderService.getAllSoldOrders(queryParams?.params),
    }
  );

  return useMemo(
    () => ({
      soldOrdersData,
      isLoadingSoldOrdersData,
    }),
    [soldOrdersData, isLoadingSoldOrdersData]
  );
};
