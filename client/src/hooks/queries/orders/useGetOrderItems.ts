import { orderService } from '@/services/order.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useGetOrderItems = (queryParams?: iFilterParams) => {
  const { data: orderItemsData, isLoading: isLoadingOrderItems } = useQuery({
    queryKey: [QUERY_KEYS.getOrderItems, queryParams?.params],
    queryFn: () => orderService.getOrderItems(queryParams?.params),
  });

  return useMemo(
    () => ({
      orderItemsData,
      isLoadingOrderItems,
    }),
    [orderItemsData, isLoadingOrderItems]
  );
};
