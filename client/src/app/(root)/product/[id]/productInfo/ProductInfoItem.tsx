import Link from 'next/link';
import { memo } from 'react';

interface ProductInfoItemProps {
  leftText: string;
  rightText: string;
  link: string;
}
function ProductInfoItem({ leftText, rightText, link }: ProductInfoItemProps) {
  return (
    <div className='flex items-baseline justify-between border-b border-neutral-200 pb-3 last:border-0'>
      <dt className='text-sm font-semibold text-neutral-700'>{leftText}</dt>
      <dd className='text-sm font-normal text-neutral-700'>
        <Link
          href={link}
          className='text-shop-light-green mt-1 text-xs font-medium hover:underline sm:text-sm'
          aria-label='Go to shop'
        >
          {rightText}
        </Link>
      </dd>
    </div>
  );
}

export default memo(ProductInfoItem);
