import { GetProductWithDetails } from '@/generated/orval/types';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { memo } from 'react';

export interface ProductDetailsProps {
  product: GetProductWithDetails;
}

function ProductDetails({ product }: ProductDetailsProps) {
  if (!product?.productDetails?.length) {
    return <NoDataFound entityName='product details' />;
  }

  return (
    <div className='mt-6'>
      <h3 className='mb-4 text-base font-semibold text-shop-primary-text'>
        Product details
      </h3>

      <dl className='space-y-3'>
        {product.productDetails.map((detail) => (
          <div
            key={detail.id}
            className='flex items-baseline justify-between border-b border-neutral-200 pb-3 last:border-0'
          >
            <dt className='text-sm font-normal text-shop-muted-text-7'>
              {detail.key}
            </dt>
            <dd className='text-sm font-normal text-shop-muted-text-7'>
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default memo(ProductDetails);
