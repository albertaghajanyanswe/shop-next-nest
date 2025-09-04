import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { STORE_URL } from '@/config/url.config';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IProductInput } from '@/shared/types/product.interface';

export const useUpdateProduct = () => {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;

  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending: isLoadingUpdate } = useMutation({
    mutationKey: QUERY_KEYS.updateProduct,
    mutationFn: (data: IProductInput) => productService.update(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreProducts });
      toast.success('Product updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update product.');
    },
  });

  return useMemo(
    () => ({
      updateProduct,
      isLoadingUpdate,
    }),
    [updateProduct, isLoadingUpdate]
  );
};
