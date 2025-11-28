import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PUBLIC_URL } from '@/config/url.config';
import { SITE_DESCRIPTION } from '@/utils/constants';
import Image from 'next/image';

function HomeBannerComponent() {
  return (
    <div className='w-full'>
      <div className='relative w-full'>
        <div className='overflow-hidden'>
          <div className='-ml-4 flex'>
            <div className='relative h-auto max-h-[450px] min-h-[320px] w-full min-w-0 shrink-0 grow-0 basis-full px-0 lg:min-h-[400px]'>
              <Image
                src='/images/banner.png'
                alt='Banner'
                className='h-full w-full object-cover opacity-90'
                width={2000}
                height={350}
                priority
                fetchPriority='high'
              />
              <div className='bg-darkColor/20 absolute inset-0'>
                <div className='relative mx-auto h-full max-w-screen-xl px-4'>
                  <div className='global-container relative h-full content-center space-y-5 py-10 sm:py-15 lg:space-y-10 lg:py-20'>
                    <div className='flex max-w-full flex-col gap-4 sm:max-w-[60%]'>
                      <h1 className='text-shop-dark-green text-xl font-bold sm:text-2xl lg:text-3xl'>
                        Your perfect choice starts here. Explore premium
                        products for every day.
                      </h1>
                      <Link href={PUBLIC_URL.shop()}>
                        <Button variant='outline' className='group'>
                          Order Now
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

// import { memo } from 'react';
// import { ArrowRight } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/Button';
// import { PUBLIC_URL } from '@/config/url.config';
// import { SITE_DESCRIPTION } from '@/utils/constants';

// function HeroComponent() {
//   return (
//     <div className='mx-auto my-24 flex max-w-4xl flex-col items-center space-y-6 py-8 text-center'>
//       <h1 className='mb-0 text-4xl font-bold tracking-tight md:text-5xl'>
//         Your shopping, your pleasure -{' '}
//         <span className='text-primary-500'>all in one place</span>
//       </h1>
//       <p className='text-muted-foreground mt-3 mb-6 text-lg'>
//         {SITE_DESCRIPTION}
//       </p>
//       <Link href={PUBLIC_URL.shop()}>
//         <Button variant='primary' className='group'>
//           Shopping{' '}
//           <ArrowRight className='ml-2 size-4 transition-all group-hover:ml-3' />
//         </Button>
//       </Link>
//     </div>
//   );
// }

// export const Hero = memo(HeroComponent);
