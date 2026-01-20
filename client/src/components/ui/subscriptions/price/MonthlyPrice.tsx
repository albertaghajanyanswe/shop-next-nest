import { memo } from 'react';

interface MonthlyPriceProps {
  price: number;
}

function MonthlyPrice({ price }: MonthlyPriceProps) {
  return (
    <div className='h-16 text-neutral-900'>
      <p className='text-3xl font-semibold lg:text-4xl'>
        ${price}
        <span className='text-sm font-medium text-neutral-700'>/monthly</span>
      </p>
      <p className='text-xs sm:min-h-4'></p>
    </div>
  );
}
export default memo(MonthlyPrice);
