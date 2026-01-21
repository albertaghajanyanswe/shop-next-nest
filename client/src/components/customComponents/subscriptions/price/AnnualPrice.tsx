import { memo } from 'react';

interface AnnualPriceProps {
  price: number;
  full: number;
  discount: number;
}

function AnnualPrice({ price, full, discount }: AnnualPriceProps) {
  return (
    <div className='text-neutral-900'>
      <div className='flex items-baseline gap-2'>
        <span className='text-3xl font-semibold lg:text-4xl'>
          ${price}
          <span className='text-sm font-medium text-neutral-700'>/annual</span>
        </span>
      </div>

      {price > 0 && (
        <span className='text-shop-light-green text-xs font-semibold'>
          <span className='text-shop-red mr-2 text-sm line-through'>
            ${full}
          </span>
          Save {discount}%
        </span>
      )}
    </div>
  );
}
export default memo(AnnualPrice);
