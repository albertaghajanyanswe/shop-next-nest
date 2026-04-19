import Link from 'next/link';
import { memo } from 'react';

interface ProductInfoItemProps {
  leftText: string;
  rightText: string;
  link: string;
}
function ProductInfoItem({ leftText, rightText, link }: ProductInfoItemProps) {
  return (
    <div className='flex items-baseline justify-between border-b border-neutral-200 dark:border-shop-bg-light pb-3 last:border-0'>
      <dt className='text-shop-muted-text-7 text-sm font-semibold'>
        {leftText}
      </dt>
      <dd className='text-shop-muted-text-7 text-sm font-normal'>
        <Link
          href={link}
          className='text-shop-light-primary mt-1 text-xs font-medium hover:underline sm:text-sm'
          aria-label='Go to shop'
        >
          {rightText}
        </Link>
      </dd>
    </div>
  );
}

export default memo(ProductInfoItem);
