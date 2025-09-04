import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { STORE_URL } from '@/config/url.config';
import { colorService } from '@/services/color.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IColorInput } from '@/shared/types/color.interface';

export const useCreateColor = () => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const storeId = params.storeId;

  const queryClient = useQueryClient();

  const { mutate: createColor, isPending: isLoadingCreate } = useMutation({
    mutationKey: QUERY_KEYS.createColor,
    mutationFn: (data: IColorInput) => colorService.create(data, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreColors });
      toast.success('Color created successfully.');
      router.push(STORE_URL.colors(storeId));
    },
    onError: () => {
      toast.error('Failed to create color.');
    },
  });

  return useMemo(
    () => ({ createColor, isLoadingCreate }),
    [createColor, isLoadingCreate]
  );
};
