'use client';

import { CategoryForm } from '../CategoryForm';
import { useGetCategoryById } from '@/hooks/queries/categories/useGetCategoryById';

export function CategoryEdit() {
  const { category, isLoadingCategory } = useGetCategoryById();

  if (isLoadingCategory) return <div>Loading...</div>;

  if (!category) return <div>Category not found</div>;

  return <CategoryForm category={category} />;
}
