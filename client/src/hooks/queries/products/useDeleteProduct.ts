import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { STORE_URL } from '@/config/url.config';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/constants';
import { productService } from '@/services/product.service';

export function useDeleteProduct() {
  const router = useRouter();
  const params = useParams<{ storeId: string; productId: string }>();
  const storeId = params.storeId;
  const productId = params.productId;
  const queryClient = useQueryClient();

  const { mutate: deleteProduct, isPending: isLoadingDelete } = useMutation({
    mutationKey: QUERY_KEYS.deleteProduct,
    mutationFn: () => productService.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreProducts });
      toast.success('Product deleted successfully.');
      router.push(STORE_URL.products(storeId));
    },
    onError: () => {
      toast.error('Failed to delete product.');
    },
  });

  return useMemo(
    () => ({ deleteProduct, isLoadingDelete }),
    [deleteProduct, isLoadingDelete]
  );
}
