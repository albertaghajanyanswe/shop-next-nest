import { memo } from 'react';

interface AnnualPriceProps {
  price: number;
  full: number;
  discount: number;
  isPopular?: boolean;
}

function AnnualPrice({ price, full, discount, isPopular }: AnnualPriceProps) {
  return (
    <div className={`h-16 ${isPopular ? 'text-neutral-900' : 'text-shop-primary-text'}`}>
      <div className='flex items-baseline gap-2'>
        <span className='text-3xl font-semibold lg:text-4xl'>
          ${price}
          <span className={`text-sm font-medium ${isPopular ? 'text-neutral-700' : 'text-shop-muted-text-7'}`}>/annual</span>
        </span>
      </div>

      {price > 0 && (
        <span className={`text-xs font-semibold ${isPopular ? 'text-neutral-800' : 'text-shop-light-primary'}`}>
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
