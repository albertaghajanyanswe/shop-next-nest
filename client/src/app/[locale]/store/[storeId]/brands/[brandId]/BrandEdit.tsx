'use client';

import { BrandForm } from '../BrabdForm';
import { useGetBrandById } from '@/hooks/queries/brands/useGetBrandById';
import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { useTranslations } from 'next-intl';

export function BrandEdit() {
  const t = useTranslations('StorePages');
  const { brand, isLoadingBrand } = useGetBrandById();
  const { categories, isLoadingCategories } = useGetCategories();
  const isLoading = isLoadingBrand || isLoadingCategories;

  if (isLoading) return <div>{t('loading')}</div>;

  if (!brand) return <div>{t('brand_not_found')}</div>;

  return <BrandForm brand={brand} categories={categories || []} />;
}
