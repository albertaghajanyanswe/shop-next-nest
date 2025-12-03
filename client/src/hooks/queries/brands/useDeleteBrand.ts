import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { STORE_URL } from '@/config/url.config';
import { useCallback, useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { brandService } from '@/services/brandService';

export function useDeleteBrand() {
  const router = useRouter();
  const params = useParams<{ storeId: string; brandId: string }>();
  const storeId = params.storeId;
  const brandId = params.brandId;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: QUERY_KEYS.deleteColor,
    mutationFn: (bId?: string) => brandService.delete(bId ?? brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBrands });
      toast.success('Brand deleted successfully.');
      router.push(STORE_URL.brands(storeId));
    },
    onError: () => {
      toast.error('Failed to delete color.');
    },
  });
  const deleteBrand = useCallback(
    (bId?: string) => mutation.mutate(bId),
    [mutation]
  );

  const isLoadingDelete = mutation.isPending;

  return useMemo(
    () => ({ deleteBrand, isLoadingDelete }),
    [deleteBrand, isLoadingDelete]
  );
}
