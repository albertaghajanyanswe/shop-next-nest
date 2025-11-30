'use client';

import { Catalog } from '@/components/ui/catalog/Catalog';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useQuery } from '@tanstack/react-query';
import ProductGallery from './product-gallery/ProductGallery';
import ProductInfo from './productInfo/ProductInfo';
import ProductReviews from './productReviews/ProductReviews';
import { GetProductWithDetails } from '@/generated/orval/types';

export interface ProductProps {
  initialProduct: GetProductWithDetails;
  similarProducts: GetProductWithDetails[];
  id?: string;
}

export default function Product({
  initialProduct,
  similarProducts,
  id,
}: ProductProps) {
  const { data: product } = useQuery({
    queryKey: QUERY_KEYS.productId(id as string),
    queryFn: () => productService.getProductById(id as string),
    initialData: initialProduct,
    enabled: !!id,
  });
  return (
    <div>
      <div className='global-container'>
        <div className='my-6 grid grid-cols-1 gap-x-8 md:grid-cols-2'>
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>
        <div className='my-6'>
          <Catalog title='Similar products' products={similarProducts} />
          <ProductReviews product={product} />
        </div>
      </div>
    </div>
  );
}
