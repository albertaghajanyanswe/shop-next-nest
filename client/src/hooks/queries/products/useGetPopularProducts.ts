import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetPopularProducts = (queryParams?: iFilterParams) => {
  const { data: popularProducts, isLoading: isLoadingPopularProducts } = useQuery({
    queryKey: [
      QUERY_KEYS.getPopularProducts[0],
      JSON.stringify(queryParams?.params),
    ],
    queryFn: () => productService.getMostPopular(queryParams?.params),
  });

  return useMemo(
    () => ({
      popularProducts,
      isLoadingPopularProducts,
    }),
    [popularProducts, isLoadingPopularProducts]
  );
};
