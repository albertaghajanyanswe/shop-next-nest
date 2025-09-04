'use client';
import { PUBLIC_URL } from '@/config/url.config';
import { IProduct } from '@/shared/types/product.interface';
import { formatPrice } from '@/utils/string/formatPrice';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../Carousel';
import { useEffect, useState } from 'react';
import AddToCardButton from '@/app/(root)/product/[id]/productInfo/AddToCardButton';
import FavoriteButton from '@/app/(root)/product/[id]/productInfo/FavoriteButton';

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateIndex = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    updateIndex();

    api.on('select', updateIndex);

    return () => {
      api.off('select', updateIndex);
    };
  }, [api]);

  return (
    <div className='bg-white'>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {product.images.map((image) => (
            <CarouselItem key={image}>
              <Link href={PUBLIC_URL.product(product.id)}>
                <Image
                  src={image}
                  alt={product.title}
                  width={300}
                  height={300}
                  className='img h-[300px] w-full rounded-lg object-cover'
                  priority
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* dots */}
      <div className='mt-2 flex justify-center gap-2'>
        {product.images.map((_, index) => (
          <button
            onClick={() => api?.scrollTo(index)}
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 w-2 cursor-pointer rounded-full transition ${
              activeIndex === index ? 'bg-gray-800' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <h3 className='mt-4 line-clamp-1 font-semibold text-gray-700'>
        {product.title}
      </h3>
      <Link
        href={PUBLIC_URL.category(product.category.id)}
        className='mt-1 text-sm text-gray-500'
      >
        {product.category.title}
      </Link>
      <div className='mt-1 text-sm text-gray-900'>
        {product.oldPrice && (
          <span className='line-through mr-2 text-gray-500'>{formatPrice(product.oldPrice)}</span>
        )}
        <span className='font-bold'>{formatPrice(product.price)}</span>
      </div>
      <div className='mt-4 flex items-start gap-x-2'>
        <AddToCardButton product={product} className='flex-10' />
        <FavoriteButton product={product} />
      </div>
    </div>
  );
}
