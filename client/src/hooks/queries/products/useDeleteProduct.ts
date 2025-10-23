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

  const mutation = useMutation({
    mutationKey: QUERY_KEYS.deleteProduct,
    mutationFn: (prodId?: string) => productService.delete(prodId ?? productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getStoreProducts, storeId] });
      toast.success('Product deleted successfully.');
      router.push(STORE_URL.products(storeId));
    },
    onError: () => {
      toast.error('Failed to delete product.');
    },
  });
  const deleteProduct = (prodId?: string) => mutation.mutate(prodId);
  const isLoadingDelete = mutation.isPending;

  return useMemo(
    () => ({ deleteProduct, isLoadingDelete }),
    [deleteProduct, isLoadingDelete]
  );
}
