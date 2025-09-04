import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { colorService } from '@/services/color.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IColorInput } from '@/shared/types/color.interface';

export const useUpdateColor = () => {
  const params = useParams<{ colorId: string }>();
  const colorId = params.colorId;

  const queryClient = useQueryClient();

  const { mutate: updateColor, isPending: isLoadingUpdate } = useMutation({
    mutationKey: QUERY_KEYS.updateColor,
    mutationFn: (data: IColorInput) => colorService.update(colorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getStoreColors });
      toast.success('Color updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update color.');
    },
  });

  return useMemo(
    () => ({
      updateColor,
      isLoadingUpdate,
    }),
    [updateColor, isLoadingUpdate]
  );
};
