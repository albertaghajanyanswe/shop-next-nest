import { brandService } from '@/services/brandService';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetBrands = () => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: brands, isLoading: isLoadingBrands } = useQuery({
    queryKey: [QUERY_KEYS.getStoreBrands, storeId],
    queryFn: () => brandService.getByStoreId(storeId),
  });

  return useMemo(
    () => ({
      brands,
      isLoadingBrands,
    }),
    [brands, isLoadingBrands]
  );
};
