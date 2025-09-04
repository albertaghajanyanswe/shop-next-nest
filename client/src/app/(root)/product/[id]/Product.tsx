'use client';

import { Catalog } from '@/components/ui/catalog/Catalog';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IProduct } from '@/shared/types/product.interface';
import { useQuery } from '@tanstack/react-query';
import ProductGallery from './product-gallery/ProductGallery';
import ProductInfo from './productInfo/ProductInfo';
import ProductReviews from './productReviews/ProductReviews';

export interface ProductProps {
  initialProduct: IProduct;
  similarProducts: IProduct[];
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
      <div className='mx-auto max-w-7xl'>
        <div className='space-y-7 px-4 py-10 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-8'>
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>
        </div>
        <Catalog title='Similar products' products={similarProducts} />
        <ProductReviews product={product} />
      </div>
    </div>
  );
}
