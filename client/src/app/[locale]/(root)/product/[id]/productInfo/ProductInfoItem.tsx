import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { memo } from 'react';

interface ProductInfoItemProps {
  leftText: string;
  rightText: string;
  link: string;
}
function ProductInfoItem({ leftText, rightText, link }: ProductInfoItemProps) {
  const t = useTranslations('ProductInfo');
  return (
    <div className='dark:border-shop-bg-light flex items-baseline justify-between py-1 last:border-0'>
      <dt className='text-shop-muted-text-7 text-sm font-semibold'>
        {leftText}
      </dt>
      <dd className='text-shop-muted-text-7 text-sm font-normal'>
        <Link
          href={link}
          className='text-shop-light-primary mt-1 text-xs font-medium hover:underline sm:text-sm'
          aria-label={t('go_to_shop')}
        >
          {rightText}
        </Link>
      </dd>
    </div>
  );
}

export default memo(ProductInfoItem);
