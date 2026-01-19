'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/Carousel';
import { PUBLIC_URL } from '@/config/url.config';
import {
  generateImgPath,
  productImgBlurParams,
  productImgParams,
} from '@/utils/imageUtils';
import { GetStoreDto } from '@/generated/orval/types';
import QueryString from 'qs';
import { ShowMoreText } from './ShowMoreText';

interface StoreCardProps {
  store: GetStoreDto;
  showInfo?: boolean;
  makeDark?: boolean;
  expandDesc?: boolean;
  heightClass?: string;
  imgClass?: string;
}

export function StoreCard({
  store,
  showInfo,
  makeDark,
  expandDesc,
  heightClass = 'h-60 sm:h-80',
  imgClass = 'object-cover lg:object-contain',
}: StoreCardProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const updateIndex = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    updateIndex();
    carouselApi.on('select', updateIndex);

    return () => {
      carouselApi.off('select', updateIndex);
    };
  }, [carouselApi]);

  const getLocationText = useMemo(() => {
    const parts = [];
    if (store.country) parts.push(store.country);
    if (store.city) parts.push(store.city);
    if (store.address) parts.push(store.address);
    return parts.join(' • ');
  }, [store]);

  const imageList =
    store?.images?.length > 0
      ? store.images
      : [
          'https://res.cloudinary.com/dvuo50sjj/image/upload/v1764779570/store-cover_yqsclu.png',
        ];
  console.log('STORE = ', store);
  return (
    <div className='flex flex-col'>
      <div className='group bg-shop-light-bg xs:text-sm relative flex flex-col overflow-hidden rounded-md text-xs'>
        <div className={`relative ${heightClass} w-full`}>
          <Carousel setApi={setCarouselApi}>
            <CarouselContent>
              {imageList.map((image) => (
                <CarouselItem key={image}>
                  <Link
                    href={PUBLIC_URL.storeShop(
                      store?.id,
                      QueryString.stringify(
                        // { filter: { storeId: [store?.id] } },
                        { skipNulls: true }
                      )
                    )}
                    // href={PUBLIC_URL.shop(
                    //   QueryString.stringify(
                    //     { filter: { storeId: [store?.id] } },
                    //     { skipNulls: true }
                    //   )
                    // )}
                    aria-label='Go to shop'
                  >
                    <div className={`relative ${heightClass} w-full`}>
                      <Image
                        src={generateImgPath(image)}
                        alt={store.title}
                        fill
                        className={`h-full w-full ${imgClass} transition-transform duration-500 group-hover:scale-105`}
                        priority
                        // {...(image
                        //   ? {
                        //       placeholder: 'blur',
                        //       blurDataURL: generateImgPath(
                        //         image,
                        //         productImgBlurParams
                        //       ),
                        //     }
                        //   : {})}
                        // sizes='(max-width: 768px) 100vw, 400px'
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Text absolute */}
          {/* <div className='absolute top-4 left-4 z-10'>
          <p className='text-xl font-semibold text-white'>{store.title}</p>
          {store.description && (
            <p className='mt-2 line-clamp-2 text-xs font-semibold text-white'>
            {store.description}
            </p>
            )}
            </div> */}
          {/* Indicator */}
          <div className='absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2'>
            {store.images.map((_, index) => (
              <button
                key={index}
                onClick={() => carouselApi?.scrollTo(index)}
                className={`h-2 w-2 rounded-full transition ${
                  activeIndex === index ? 'bg-white' : 'bg-gray-300/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Dark gradient for text readability */}
          {/* <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/10' /> */}
          {makeDark && (
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/15' />
          )}
        </div>
      </div>
      {showInfo && (
        <div className='mt-2'>
          <p className='text-xl leading-relaxed font-semibold text-neutral-800'>
            {store.title}
          </p>
          {store.description &&
            (expandDesc ? (
              <ShowMoreText
                className='text-muted-foreground text-sm'
                text={store.description}
              />
            ) : (
              <p className='my-2 line-clamp-2 text-sm leading-relaxed font-medium text-neutral-700'>
                {store.description}
              </p>
            ))}
          {getLocationText && (
            <p className='text-xs leading-relaxed text-neutral-600'>
              {getLocationText}
            </p>
          )}
          {store.phone && (
            <p className='text-xs text-neutral-600'>
              Phone number: {store.phone}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
