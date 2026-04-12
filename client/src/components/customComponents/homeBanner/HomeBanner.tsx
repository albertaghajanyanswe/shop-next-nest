import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PUBLIC_URL } from '@/config/url.config';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

function HomeBannerComponent() {
  const t = useTranslations('HomePage');

  return (
    <div className='w-full'>
      <div className='relative w-full'>
        <div className='overflow-hidden'>
          <div className='-ml-4 flex'>
            <div className='relative h-auto max-h-[450px] min-h-[300px] w-full min-w-0 shrink-0 grow-0 basis-full px-0 lg:min-h-[450px]'>
              <Image
                src='https://res.cloudinary.com/dvuo50sjj/image/upload/w_2000,f_auto,q_auto/v1764674699/banner_wmezby.png'
                className='h-full w-full object-cover opacity-90'
                width={2000}
                height={350}
                alt='Banner'
                priority
                fetchPriority='high'
              />

              <div className='bg-darkColor/20 absolute inset-0'>
                <div className='relative mx-auto h-full max-w-screen-xl px-4'>
                  <div className='global-container relative h-full content-center space-y-5 py-10 sm:py-15 lg:space-y-10 lg:py-20'>
                    <div className='flex max-w-full flex-col gap-4 sm:max-w-[60%]'>
                      <h1 className='text-shop-primary text-xl font-semibold sm:text-2xl lg:text-3xl'>
                        {t('banner_title')}
                      </h1>
                      <Link href={PUBLIC_URL.shop()}>
                        <Button variant='primary' className='group'>
                          {t('banner_button')}
                          <ArrowRight className='ml-[4px] size-4 transition-all group-hover:ml-[5px]' />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const HomeBanner = memo(HomeBannerComponent);
