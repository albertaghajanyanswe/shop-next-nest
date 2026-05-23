import { useTranslations } from 'next-intl';
import { GetProductWithDetails } from '@/generated/orval/types';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { memo } from 'react';

export interface ProductDetailsProps {
  product: GetProductWithDetails;
}

function ProductDetails({ product }: ProductDetailsProps) {
  const t = useTranslations('ProductDetails');
  if (!product?.productDetails?.length) {
    return <NoDataFound entityName={t('no_data_entity')} />;
  }

  return (
    <div className='dark:md:border-shop-light-bg dark:border-dark-3 rounded-md bg-shop-bg-default mt-6 border border-neutral-200 p-5'>
      <h3 className='text-shop-primary-text mb-4 text-base font-semibold'>
        {t('title')}
      </h3>

      <dl className='space-y-3'>
        {product.productDetails.map((detail) => (
          <div
            key={detail.id}
            className='dark:border-shop-light-bg flex items-baseline justify-between border-b border-neutral-300 pb-3 last:border-0'
          >
            <dt className='text-shop-muted-text-7 text-sm font-normal'>
              {detail.key}
            </dt>
            <dd className='text-shop-muted-text-7 text-sm font-normal'>
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default memo(ProductDetails);
