import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { STORE_URL } from '@/config/url.config';
import { useCallback, useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { colorService } from '@/services/color.service';

export function useDeleteColor() {
  const router = useRouter();
  const params = useParams<{ storeId: string; colorId: string }>();
  const storeId = params.storeId;
  const colorId = params.colorId;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: QUERY_KEYS.deleteColor,
    mutationFn: (cId?: string) => colorService.delete(cId ?? colorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreColors });
      toast.success('Color deleted successfully.');
      router.push(STORE_URL.colors(storeId));
    },
    onError: () => {
      toast.error('Failed to delete color.');
    },
  });

  const deleteColor = useCallback(
    (cId?: string) => mutation.mutate(cId),
    [mutation]
  );

  const isLoadingDelete = mutation.isPending;

  return useMemo(
    () => ({ deleteColor, isLoadingDelete }),
    [deleteColor, isLoadingDelete]
  );
}
