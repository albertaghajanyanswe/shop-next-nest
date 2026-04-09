'use client';

import { Catalog } from '@/components/customComponents/catalog/Catalog';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useQuery } from '@tanstack/react-query';
import ProductGallery from './productGallery/ProductGallery';
import ProductInfo from './productInfo/ProductInfo';
import { GetProductWithDetails } from '@/generated/orval/types';
import {
  CustomTabs,
  TabItem,
} from '@/components/customComponents/customTabs/CustomTabs';
import { useMemo, lazy, Suspense } from 'react';
import ProductDetails from './productDetails/ProductDetails';
const ProductReviews = lazy(() => import('./productReviews/ProductReviews'));

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

  const LazyTabContent = ({ children }: { children: React.ReactNode }) => (
    <Suspense
      fallback={
        <div className='py-4 text-center text-shop-primary-text'>Loading...</div>
      }
    >
      {children}
    </Suspense>
  );

  const tabs: TabItem[] = useMemo(() => {
    return [
      {
        id: 'details',
        label: 'Details',
        content: (
          <LazyTabContent>
            <ProductDetails product={product} />
          </LazyTabContent>
        ),
      },
      {
        id: 'desc',
        label: 'Description',
        content: (
          <div className='bg-shop-light-bg rounded-md p-4'>
            {product.description}
          </div>
        ),
      },
      {
        id: 'review',
        label: 'Reviews',
        content: (
          <LazyTabContent>
            <ProductReviews product={product} />
          </LazyTabContent>
        ),
      },
    ];
  }, [product]);

  return (
    <>
      <div className='my-6 grid w-full grid-cols-[6fr_6fr] gap-x-4 gap-y-0 md:grid-cols-2 xl:grid-cols-[7fr_5fr]'>
        <div className='bg-neutral100 order-1 col-span-2 row-span-1 w-full rounded-none sm:rounded-2xl md:col-span-1'>
          <ProductGallery product={product} />
        </div>
        <div className='order-2 col-span-2 row-span-5 mt-[24px] w-full md:col-span-1 md:mt-[0px]'>
          <ProductInfo product={product} />
        </div>
      </div>
      <Catalog title='Similar products' products={similarProducts} />
      <div className='mt-6 mb-4 w-full max-w-3xl'>
        <CustomTabs tabs={tabs} defaultValue='details' />
      </div>
    </>
  );
}
