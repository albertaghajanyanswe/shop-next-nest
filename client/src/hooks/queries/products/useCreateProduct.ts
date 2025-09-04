import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { STORE_URL } from '@/config/url.config';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IProductInput } from '@/shared/types/product.interface';

export const useCreateProduct = () => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const storeId = params.storeId;

  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending: isLoadingCreate } = useMutation({
    mutationKey: QUERY_KEYS.createProduct,
    mutationFn: (data: IProductInput) => productService.create(data, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreProducts });
      toast.success('Product created successfully.');
      router.push(STORE_URL.products(storeId));
    },
    onError: () => {
      toast.error('Failed to create product.');
    },
  });

  return useMemo(
    () => ({
      createProduct,
      isLoadingCreate,
    }),
    [createProduct, isLoadingCreate]
  );
};
