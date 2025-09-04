'use client';

import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { useGetColors } from '@/hooks/queries/colors/useGetColors';
import { ProductForm } from '../ProductForm';
import { useGetBrands } from '@/hooks/queries/brands/useGetBrands';

export function CreateProduct() {
  const { categories, isLoadingCategories } = useGetCategories();
  const { colors, isLoadingColors } = useGetColors();
  const { brands, isLoadingBrands } = useGetBrands();
  const isLoading = isLoadingCategories || isLoadingColors || isLoadingBrands;

  if (isLoading) return <div>Loading...</div>;

  return (
    <ProductForm
      categories={categories || []}
      colors={colors || []}
      brands={brands || []}
    />
  );
}
