import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '@/services/store.service';
import { useRouter } from 'next/navigation';
import { ICreateStore } from '@/shared/types/store.interface';
import toast from 'react-hot-toast';
import { STORE_URL } from '@/config/url.config';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/constants';

export function useCreateStore() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: createStore, isPending: isLoadingCreate } = useMutation({
    mutationKey: QUERY_KEYS.createStore,
    mutationFn: (data: ICreateStore) => storeService.create(data),
    onSuccess: (store) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      toast.success('Store created successfully.');
      router.push(STORE_URL.home(store.id));
    },
    onError: () => {
      toast.error('Failed to create store.');
    },
  });

  return useMemo(
    () => ({ createStore, isLoadingCreate }),
    [createStore, isLoadingCreate]
  );
}
