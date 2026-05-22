'use client';

import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { useGetColors } from '@/hooks/queries/colors/useGetColors';
import { useGetProductById } from '@/hooks/queries/products/useGetProductById';
import { ProductForm } from '../ProductForm';
import { useGetBrands } from '@/hooks/queries/brands/useGetBrands';
import { useTranslations } from 'next-intl';

export function ProductEdit() {
  const t = useTranslations('StorePages');
  const { product, isLoadingProduct } = useGetProductById();
  const { categoriesData, isLoadingCategoriesData } = useGetCategories();
  const { colorsData, isLoadingColorsData } = useGetColors();
  const { brandsData, isLoadingBrandsData } = useGetBrands();
  const isLoading =
    isLoadingProduct ||
    isLoadingCategoriesData ||
    isLoadingColorsData ||
    isLoadingBrandsData;

  if (isLoading) return <div>{t('loading')}</div>;

  if (!product) return <div>{t('product_not_found')}</div>;
  return (
    <ProductForm
      product={product}
      categories={categoriesData?.categories || []}
      colors={colorsData?.colors || []}
      brands={brandsData?.brands || []}
    />
  );
}
