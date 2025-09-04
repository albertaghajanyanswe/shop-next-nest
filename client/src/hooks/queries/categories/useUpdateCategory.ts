import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { QUERY_KEYS } from '@/shared/constants';
import { ICategoryInput } from '@/shared/types/category.interface';

export const useUpdateCategory = () => {
  const params = useParams<{ categoryId: string }>();
  const categoryId = params.categoryId;

  const queryClient = useQueryClient();

  const { mutate: updateCategory, isPending: isLoadingUpdate } = useMutation({
    mutationKey: QUERY_KEYS.updateCategory,
    mutationFn: (data: ICategoryInput) => categoryService.update(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getStoreCategories,
      });
      toast.success('Category updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update category.');
    },
  });

  return useMemo(
    () => ({
      updateCategory,
      isLoadingUpdate,
    }),
    [updateCategory, isLoadingUpdate]
  );
};
