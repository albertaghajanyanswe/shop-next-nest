'use client';

import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { BrandForm } from '../BrabdForm';

export function CreateBrand() {
  // const { categories, isLoadingCategories } = useGetCategories();

  // if (isLoadingCategories) return <div>Loading...</div>;

  return <BrandForm />;
}
