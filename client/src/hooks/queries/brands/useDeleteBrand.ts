import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { STORE_URL } from '@/config/url.config';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/constants';
import { brandService } from '@/services/brandService';

export function useDeleteBrand() {
  const router = useRouter();
  const params = useParams<{ storeId: string; brandId: string }>();
  const storeId = params.storeId;
  const brandId = params.brandId;
  const queryClient = useQueryClient();

  const { mutate: deleteBrand, isPending: isLoadingDelete } = useMutation({
    mutationKey: QUERY_KEYS.deleteColor,
    mutationFn: () => brandService.delete(brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreBrands });
      toast.success('Brand deleted successfully.');
      router.push(STORE_URL.brands(storeId));
    },
    onError: () => {
      toast.error('Failed to delete color.');
    },
  });

  return useMemo(
    () => ({ deleteBrand, isLoadingDelete }),
    [deleteBrand, isLoadingDelete]
  );
}
