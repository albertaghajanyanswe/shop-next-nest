import { SITE_NAME } from '@/utils/constants';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';
import { useTranslations } from 'next-intl';

function InfoBlock() {
  const t = useTranslations('HowItWorks');

  return (
    <>
      <div className='card-linear-grad dark:card-flame mt-3 rounded-md bg-linear-to-r p-4'>
        <h2 className='text-shop-primary-text mb-2 text-xl leading-relaxed font-semibold'>
          {t('info_block_title', { siteName: SITE_NAME })}
        </h2>
        <Image
          src='/images/header.webp'
          alt='Header'
          width={2500}
          height={80}
          className='hoverEffect max-h-[350px] min-h-auto w-full rounded-md object-contain group-hover:scale-110 md:max-h-[450px]'
          priority
        />

        <p className='text-shop-primary-text mt-4 leading-relaxed'>
          <strong>{t('info_block_intro')}</strong>
        </p>

        <p className='text-shop-primary-text mt-6 mb-2 leading-relaxed'>
          {t('info_block_my_stores_intro')}
        </p>

        <ul className='text-shop-primary-text grid list-inside list-disc grid-cols-1 gap-2 md:grid-cols-2'>
          <li className='text-shop-primary-text flex flex-row items-center justify-start gap-4 font-medium'>
            <CheckCircle className='h-4 w-4 text-emerald-200' />
            {t('info_block_item_1')}
          </li>
          <li className='text-shop-primary-text flex flex-row items-center justify-start gap-4 font-medium'>
            <CheckCircle className='h-4 w-4 text-emerald-200' />
            {t('info_block_item_2')}
          </li>
          <li className='text-shop-primary-text flex flex-row items-center justify-start gap-4 font-medium'>
            <CheckCircle className='h-4 w-4 text-emerald-200' />
            {t('info_block_item_3')}
          </li>
          <li className='text-shop-primary-text flex flex-row items-center justify-start gap-4 font-medium'>
            <CheckCircle className='h-4 w-4 text-emerald-200' />
            {t('info_block_item_4')}
          </li>
          <li className='text-shop-primary-text flex flex-row items-center justify-start gap-4 font-medium'>
            <CheckCircle className='h-4 w-4 text-emerald-200' />
            {t('info_block_item_5')}
          </li>
          <li className='text-shop-primary-text flex flex-row items-center justify-start gap-4 font-medium'>
            <CheckCircle className='h-4 w-4 text-emerald-200' />
            {t('info_block_item_6')}
          </li>
        </ul>

        <p className='text-shop-primary-text mt-6 leading-relaxed'>
          {t('info_block_outro')}
        </p>
      </div>
    </>
  );
}

export default memo(InfoBlock);
