import { categoryService } from '@/services/category.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetCategoryById = () => {
  const params = useParams<{ categoryId: string }>();
  const categoryId = params.categoryId;

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: [QUERY_KEYS.getCategoryById, categoryId],
    queryFn: () => categoryService.getById(categoryId),
  });

  return useMemo(
    () => ({
      category,
      isLoadingCategory,
    }),
    [category, isLoadingCategory]
  );
};
