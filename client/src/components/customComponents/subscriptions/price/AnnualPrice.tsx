import { memo } from 'react';

interface AnnualPriceProps {
  price: number;
  full: number;
  discount: number;
  isPopular?: boolean;
}

function AnnualPrice({ price, full, discount, isPopular }: AnnualPriceProps) {
  return (
    <div className={`text-shop-primary-text h-16`}>
      <div className='flex items-baseline gap-2'>
        <span className='text-3xl font-semibold lg:text-4xl'>
          ${price}
          <span className={`text-shop-muted-text-7 text-sm font-medium`}>
            /annual
          </span>
        </span>
      </div>

      {price > 0 && (
        <span className={`text-shop-light-primary text-xs font-semibold`}>
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
