import { brandService } from '@/services/brandService';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetBrandById = () => {
  const params = useParams<{ brandId: string }>();
  const brandId = params.brandId;

  const { data: brand, isLoading: isLoadingBrand } = useQuery({
    queryKey: [QUERY_KEYS.getBrandById, brandId],
    queryFn: () => brandService.getById(brandId),
  });

  return useMemo(
    () => ({
      brand,
      isLoadingBrand,
    }),
    [brand, isLoadingBrand]
  );
};
