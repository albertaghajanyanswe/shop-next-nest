'use client';

import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { useGetColors } from '@/hooks/queries/colors/useGetColors';
import { ProductForm } from '../ProductForm';
import { useGetBrands } from '@/hooks/queries/brands/useGetBrands';

export function CreateProduct() {
  const { categoriesData, isLoadingCategoriesData } = useGetCategories();
  const { colorsData, isLoadingColorsData } = useGetColors();
  const { brandsData, isLoadingBrandsData } = useGetBrands();
  const isLoading =
    isLoadingCategoriesData || isLoadingColorsData || isLoadingBrandsData;

  if (isLoading) return <div>Loading...</div>;

  return (
    <ProductForm
      categories={categoriesData?.categories || []}
      colors={colorsData?.colors || []}
      brands={brandsData?.brands || []}
    />
  );
}
