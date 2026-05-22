'use client';

import { CategoryForm } from '../CategoryForm';
import { useGetCategoryById } from '@/hooks/queries/categories/useGetCategoryById';
import { useTranslations } from 'next-intl';

export function CategoryEdit() {
  const t = useTranslations('StorePages');
  const { category, isLoadingCategory } = useGetCategoryById();

  if (isLoadingCategory) return <div>{t('loading')}</div>;

  if (!category) return <div>{t('category_not_found')}</div>;

  return <CategoryForm category={category} />;
}
