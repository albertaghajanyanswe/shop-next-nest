import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { storeService } from '@/services/store.service';
import { useParams, useRouter } from 'next/navigation';
import { PUBLIC_URL } from '@/config/url.config';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/constants';

export function useDeleteStore() {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { mutate: deleteStore, isPending: isLoadingDelete } = useMutation({
    mutationKey: QUERY_KEYS.deleteStore,
    mutationFn: () => storeService.delete(storeId),
    onSuccess: () => {
      toast.success('Store deleted successfully.');
      router.push(PUBLIC_URL.home());
    },
    onError: () => {
      toast.error('Failed to delete store.');
    },
  });

  return useMemo(
    () => ({ deleteStore, isLoadingDelete }),
    [deleteStore, isLoadingDelete]
  );
}
