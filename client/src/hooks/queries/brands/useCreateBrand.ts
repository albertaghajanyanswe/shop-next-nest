import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { STORE_URL } from '@/config/url.config';
import { QUERY_KEYS } from '@/shared/constants';
import { IBrandInput } from '@/shared/types/brand.interface';
import { brandService } from '@/services/brandService';

export const useCreateBrand = () => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const storeId = params.storeId;

  const queryClient = useQueryClient();

  const { mutate: createBrand, isPending: isLoadingCreate } = useMutation({
    mutationKey: QUERY_KEYS.createBrand,
    mutationFn: (data: IBrandInput) => brandService.create(data, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreColors });
      toast.success('Brand created successfully.');
      router.push(STORE_URL.brands(storeId));
    },
    onError: () => {
      toast.error('Failed to create brand.');
    },
  });

  return useMemo(
    () => ({ createBrand, isLoadingCreate }),
    [createBrand, isLoadingCreate]
  );
};
