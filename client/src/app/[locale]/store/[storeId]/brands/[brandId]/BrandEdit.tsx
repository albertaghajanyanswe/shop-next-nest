'use client';

import { BrandForm } from '../BrandForm';
import { useGetBrandById } from '@/hooks/queries/brands/useGetBrandById';
import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { useTranslations } from 'next-intl';

export function BrandEdit() {
  const t = useTranslations('StorePages');
  const { brand, isLoadingBrand } = useGetBrandById();
  const { categoriesData, isLoadingCategoriesData } = useGetCategories();
  const isLoading = isLoadingBrand || isLoadingCategoriesData;

  if (isLoading) return <div>{t('loading')}</div>;

  if (!brand) return <div>{t('brand_not_found')}</div>;

  return <BrandForm brand={brand} categories={categoriesData?.categories || []} />;
}
