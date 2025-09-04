import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { STORE_URL } from '@/config/url.config';
import { categoryService } from '@/services/category.service';
import { QUERY_KEYS } from '@/shared/constants';
import { ICategoryInput } from '@/shared/types/category.interface';

export const useCreateCategory = () => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const storeId = params.storeId;

  const queryClient = useQueryClient();

  const { mutate: createCategory, isPending: isLoadingCreate } = useMutation({
    mutationKey: QUERY_KEYS.createCategory,
    mutationFn: (data: ICategoryInput) => categoryService.create(data, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getStoreCategories,
      });
      toast.success('Category created successfully.');
      router.push(STORE_URL.categories(storeId));
    },
    onError: () => {
      toast.error('Failed to create category.');
    },
  });

  return useMemo(
    () => ({ createCategory, isLoadingCreate }),
    [createCategory, isLoadingCreate]
  );
};
