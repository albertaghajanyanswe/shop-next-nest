import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

export const NoProductsFound = () => {
  const t = useTranslations('Loading');
  return (
    <div className='bg-shop-light-bg mt-0 flex min-h-50 w-full flex-col items-center justify-center space-y-3 rounded-md py-8 text-center'>
      <p className='text-shop-primary-text text-2xl font-semibold'>
        {t('no_products_found')}
      </p>
      <p className='text-shop-muted-text-6'>{t('no_products_matching')}</p>
      <div className='text-darkRed animate-scale-pulse-slow flex items-center space-x-2'>
        <LoaderCircle className='text-shop-orange animate-spin' />
        <span className='text-shop-orange'>{t('restocking_shortly')}</span>
      </div>
      <p className='text-shop-muted-text-5 text-sm'>{t('check_back_later')}</p>
    </div>
  );
};

export default memo(NoProductsFound);
