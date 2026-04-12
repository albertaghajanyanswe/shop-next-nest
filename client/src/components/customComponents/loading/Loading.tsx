import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

function Loading({ text }: { text?: string }) {
  const t = useTranslations('Loading');
  return (
    <div className='bg-shop-light-bg my-6 flex min-h-50 w-full flex-col items-center justify-center space-y-3 rounded-md py-8 text-center'>
      <p className='text-shop-primary-text text-2xl font-semibold'>
        {t('please_wait')}
      </p>
      <div className='text-darkRed animate-scale-pulse-slow flex items-center space-x-2'>
        <LoaderCircle className='text-shop-orange animate-spin' />
        <span className='text-shop-orange'>{text}</span>
      </div>
    </div>
  );
}

export default memo(Loading);
