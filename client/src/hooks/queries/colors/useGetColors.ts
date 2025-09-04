import { colorService } from '@/services/color.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetColors = () => {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { data: colors, isLoading: isLoadingColors } = useQuery({
    queryKey: [QUERY_KEYS.getStoreColors, storeId],
    queryFn: () => colorService.getByStoreId(storeId),
  });

  return useMemo(
    () => ({
      colors,
      isLoadingColors,
    }),
    [colors, isLoadingColors]
  );
};
