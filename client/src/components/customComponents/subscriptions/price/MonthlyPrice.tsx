import { memo } from 'react';

interface MonthlyPriceProps {
  price: number;
  isPopular?: boolean;
}

function MonthlyPrice({ price, isPopular }: MonthlyPriceProps) {
  return (
    <div
      className={`h-16 text-shop-primary-text`}
    >
      <p className='text-3xl font-semibold lg:text-4xl'>
        ${price}
        <span
          className={`text-sm font-medium text-shop-muted-text-7`}
        >
          /monthly
        </span>
      </p>
      <p className='text-xs sm:min-h-4'></p>
    </div>
  );
}
export default memo(MonthlyPrice);
