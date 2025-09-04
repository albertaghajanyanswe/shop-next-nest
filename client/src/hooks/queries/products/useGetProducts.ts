import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetProducts = () => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: [QUERY_KEYS.getStoreProducts, storeId],
    queryFn: () => productService.getByStoreId(storeId),
  });

  return useMemo(
    () => ({
      products,
      isLoadingProducts,
    }),
    [products, isLoadingProducts]
  );
};
