import { useTranslations } from 'next-intl';
import { memo } from 'react';

interface AnnualPriceProps {
  price: number;
  full: number;
  discount: number;
  isPopular?: boolean;
}

function AnnualPrice({ price, full, discount, isPopular }: AnnualPriceProps) {
  const t = useTranslations('Subscriptions');
  return (
    <div className={`text-shop-primary-text h-16`}>
      <div className='flex items-baseline gap-2'>
        <span className='text-3xl font-semibold lg:text-4xl'>
          ${price}
          <span className={`text-shop-muted-text-7 text-sm font-medium`}>
            {t('per_year')}
          </span>
        </span>
      </div>

      {price > 0 && (
        <span className={`${isPopular ? 'text-white' : 'text-shop-light-primary'} text-xs font-semibold`}>
          <span className='text-shop-red mr-2 text-sm line-through'>
            ${full}
          </span>
          {t('save_label', { discount })}
        </span>
      )}
    </div>
  );
}
export default memo(AnnualPrice);
