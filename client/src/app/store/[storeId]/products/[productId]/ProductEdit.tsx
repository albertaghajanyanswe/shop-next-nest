'use client';

import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { useGetColors } from '@/hooks/queries/colors/useGetColors';
import { useGetProductById } from '@/hooks/queries/products/useGetProductById';
import { ProductForm } from '../ProductForm';
import { useGetBrands } from '@/hooks/queries/brands/useGetBrands';

export function ProductEdit() {
  const { product, isLoadingProduct } = useGetProductById();
  const { categories, isLoadingCategories } = useGetCategories();
  const { colors, isLoadingColors } = useGetColors();
  const { brands, isLoadingBrands } = useGetBrands();
  const isLoading =
    isLoadingProduct ||
    isLoadingCategories ||
    isLoadingColors ||
    isLoadingBrands;

  if (isLoading) return <div>Loading...</div>;

  if (!product) return <div>Product not found</div>;

  return (
    <ProductForm
      product={product}
      categories={categories || []}
      colors={colors || []}
      brands={brands || []}
    />
  );
}
