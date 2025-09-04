import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { QUERY_KEYS } from '@/shared/constants';

export const useGetCategories = () => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: [QUERY_KEYS.getStoreCategories, storeId],
    queryFn: () => categoryService.getByStoreId(storeId),
  });

  return useMemo(
    () => ({
      categories,
      isLoadingCategories,
    }),
    [categories, isLoadingCategories]
  );
};
