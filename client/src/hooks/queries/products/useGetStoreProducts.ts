import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetStoreProducts = (queryParams?: iFilterParams) => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: productsData, isLoading: isLoadingProductsData } = useQuery({
    queryKey: [
      QUERY_KEYS.getStoreProducts[0],
      storeId,
      JSON.stringify(queryParams?.params),
    ],
    queryFn: () => productService.getByStoreId(storeId, queryParams?.params),
  });

  return useMemo(
    () => ({
      productsData,
      isLoadingProductsData,
    }),
    [productsData, isLoadingProductsData]
  );
};
