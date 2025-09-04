'use client';

import { useGetCategories } from "@/hooks/queries/categories/useGetCategories";
import { BrandForm } from "../BrabdForm";


export function CreateBrand() {
  const { categories, isLoadingCategories } = useGetCategories();

  console.log('categories', categories);
  if (isLoadingCategories) return <div>Loading...</div>;

  return <BrandForm categories={categories || []} />;
}
