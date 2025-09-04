import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetProductById = () => {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: [QUERY_KEYS.getProductById, productId],
    queryFn: () => productService.getById(productId),
  });

  return useMemo(
    () => ({
      product,
      isLoadingProduct,
    }),
    [product, isLoadingProduct]
  );
};
