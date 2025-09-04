import { colorService } from '@/services/color.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useGetColorById = () => {
  const params = useParams<{ colorId: string }>();
  const colorId = params.colorId;

  const { data: color, isLoading: isLoadingColor } = useQuery({
    queryKey: [QUERY_KEYS.getColorById, colorId],
    queryFn: () => colorService.getById(colorId),
  });

  return useMemo(
    () => ({
      color,
      isLoadingColor,
    }),
    [color, isLoadingColor]
  );
};
