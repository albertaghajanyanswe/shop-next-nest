import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';

export const useGetCategories = (queryParams?: iFilterParams) => {
  const { data: categoriesData, isLoading: isLoadingCategoriesData } = useQuery({
    queryKey: [QUERY_KEYS.getCategories, queryParams?.params],
    queryFn: () => categoryService.getAll(queryParams?.params),
  });

  return useMemo(
    () => ({
      categoriesData,
      isLoadingCategoriesData,
    }),
    [categoriesData, isLoadingCategoriesData]
  );
};
