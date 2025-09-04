import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { IBrandInput } from '@/shared/types/brand.interface';
import { brandService } from '@/services/brandService';

export const useUpdateBrand = () => {
  const params = useParams<{ brandId: string }>();
  const brandId = params.brandId;

  const queryClient = useQueryClient();

  const { mutate: updateBrand, isPending: isLoadingUpdate } = useMutation({
    mutationKey: QUERY_KEYS.updateColor,
    mutationFn: (data: IBrandInput) => brandService.update(brandId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreBrands });
      toast.success('Brand updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update brand.');
    },
  });

  return useMemo(
    () => ({
      updateBrand,
      isLoadingUpdate,
    }),
    [updateBrand, isLoadingUpdate]
  );
};
