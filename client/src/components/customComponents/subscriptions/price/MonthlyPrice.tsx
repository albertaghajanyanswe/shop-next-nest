import { useTranslations } from 'next-intl';
import { memo } from 'react';

interface MonthlyPriceProps {
  price: number;
  isPopular?: boolean;
}

function MonthlyPrice({ price, isPopular }: MonthlyPriceProps) {
  const t = useTranslations('Subscriptions');
  return (
    <div className={`${isPopular ? 'text-white' : 'text-shop-primary-text'} h-16`}>
      <p className='text-3xl font-semibold lg:text-4xl'>
        ${price}
        <span className={`${isPopular ? 'text-white' : 'text-shop-muted-text-7'} text-sm font-semibold`}>
          {t('per_month')}
        </span>
      </p>
      <p className='text-xs sm:min-h-4'></p>
    </div>
  );
}
export default memo(MonthlyPrice);
