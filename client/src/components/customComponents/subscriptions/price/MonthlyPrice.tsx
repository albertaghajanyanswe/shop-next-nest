import { memo } from 'react';

interface MonthlyPriceProps {
  price: number;
  isPopular?: boolean;
}

function MonthlyPrice({ price, isPopular }: MonthlyPriceProps) {
  return (
    <div className={`text-shop-primary-text h-16`}>
      <p className='text-3xl font-semibold lg:text-4xl'>
        ${price}
        <span className={`text-shop-muted-text-7 text-sm font-medium`}>
          /monthly
        </span>
      </p>
      <p className='text-xs sm:min-h-4'></p>
    </div>
  );
}
export default memo(MonthlyPrice);
