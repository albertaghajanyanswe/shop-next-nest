import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { STORE_URL } from '@/config/url.config';
import { QUERY_KEYS } from '@/shared/constants';
import { categoryService } from '@/services/category.service';

export function useDeleteCategory() {
  const router = useRouter();
  const params = useParams<{ storeId: string; categoryId: string }>();
  const storeId = params.storeId;
  const categoryId = params.categoryId;
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isPending: isLoadingDelete } = useMutation({
    mutationKey: QUERY_KEYS.deleteCategory,
    mutationFn: () => categoryService.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getStoreCategories,
      });
      toast.success('Category deleted successfully.');
      router.push(STORE_URL.categories(storeId));
    },
    onError: () => {
      toast.error('Failed to delete category.');
    },
  });

  return useMemo(
    () => ({ deleteCategory, isLoadingDelete }),
    [deleteCategory, isLoadingDelete]
  );
}
