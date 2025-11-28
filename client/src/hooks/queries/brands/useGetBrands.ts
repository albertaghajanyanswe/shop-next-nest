import { brandService } from '@/services/brandService';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { iFilterParams } from '@/shared/types/filter.interface';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetBrands = (queryParams?: iFilterParams) => {
  const { data: brandsData, isLoading: isLoadingBrandsData } = useQuery({
    queryKey: [QUERY_KEYS.getBrands, queryParams?.params],
    queryFn: () => brandService.getAll(queryParams?.params),
  });

  return useMemo(
    () => ({
      brandsData,
      isLoadingBrandsData,
    }),
    [brandsData, isLoadingBrandsData]
  );
};
