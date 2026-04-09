'use client';

import { useGetColorById } from '@/hooks/queries/colors/useGetColorById';
import { ColorForm } from '../ColorForm';

export function ColorEdit() {
  const { color, isLoadingColor } = useGetColorById();
  if (isLoadingColor) return <div>Loading...</div>;

  if (!color) return <div>Color not found</div>;

  return <ColorForm color={color} />;
}
