'use client';

import { BrandForm } from '../BrabdForm';
import { useGetBrandById } from '@/hooks/queries/brands/useGetBrandById';
import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';

export function BrandEdit() {
  const { brand, isLoadingBrand } = useGetBrandById();
  const { categories, isLoadingCategories } = useGetCategories();
  const isLoading = isLoadingBrand || isLoadingCategories;

  if (isLoading) return <div>Loading...</div>;

  if (!brand) return <div>Brand not found</div>;

  return <BrandForm brand={brand} categories={categories || []} />;
}
