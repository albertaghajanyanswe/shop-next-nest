import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storeService } from '@/services/store.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IUpdateStore } from '@/shared/types/store.interface';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useMemo } from 'react';

export function useUpdateStore() {
  const queryClient = useQueryClient();
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: store } = useQuery({
    queryKey: QUERY_KEYS.store,
    queryFn: () => storeService.getById(storeId),
  });

  const { mutate: updateStore, isPending: isLoadingUpdate } = useMutation({
    mutationKey: QUERY_KEYS.updateStore,
    mutationFn: (data: IUpdateStore) => storeService.update(storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      toast.success('Store updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update store.');
    },
  });

  return useMemo(() => ({
    store,
    updateStore,
    isLoadingUpdate,
  }), [store, updateStore, isLoadingUpdate])
}
