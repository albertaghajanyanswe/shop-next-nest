import { orderService } from '@/services/order.service';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetOrderById = (orderId: string) => {
  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: [QUERY_KEYS.getOrderById[0], orderId],
    queryFn: () => orderService.getById(orderId),
  });

  return useMemo(
    () => ({
      order,
      isLoadingOrder,
    }),
    [order, isLoadingOrder]
  );
};
