import { orderService } from '@/services/order.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useGetOrders = (queryParams?: iFilterParams) => {

  const { data: ordersData, isLoading: isLoadingOrdersData } = useQuery({
    queryKey: [QUERY_KEYS.getStoreProducts, queryParams?.params],
    queryFn: () => orderService.getAll(queryParams?.params),
  });

  return useMemo(
    () => ({
      ordersData,
      isLoadingOrdersData,
    }),
    [ordersData, isLoadingOrdersData]
  );
};
